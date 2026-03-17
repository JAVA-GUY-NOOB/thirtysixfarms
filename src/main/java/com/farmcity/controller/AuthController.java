package com.farmcity.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.UserAccount;
import com.farmcity.repository.UserAccountRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final UserAccountRepository userAccountRepository;
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {
        String username = (String) body.getOrDefault("username", "");
        String password = (String) body.getOrDefault("password", "");
        String email = (String) body.getOrDefault("email", "");
        if (username.isBlank() || password.isBlank() || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username, password, and email are required"));
        }
        Optional<UserAccount> existing = userAccountRepository.findByUsername(username);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username already exists"));
        }
        UserAccount user = new UserAccount();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setRole("USER");
        userAccountRepository.save(user);
        return ResponseEntity.ok(Map.of("userId", user.getId(), "username", user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        String username = (String) body.getOrDefault("username", "");
        String password = (String) body.getOrDefault("password", "");
        Optional<UserAccount> userOptional = userAccountRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        UserAccount user = userOptional.get();
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        return ResponseEntity.ok(Map.of("token", token, "userId", user.getId(), "username", user.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        if (token != null) {
            sessions.remove(token);
        }
        return ResponseEntity.ok(Map.of("loggedOut", true));
    }

    @PostMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        if (token == null || !sessions.containsKey(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid session"));
        }
        Long userId = sessions.get(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid session"));
        }
        Optional<UserAccount> user = userAccountRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid session"));
        }
        UserAccount u = user.get();
        return ResponseEntity.ok(Map.of("userId", u.getId(), "username", u.getUsername(), "email", u.getEmail(), "role", u.getRole()));
    }
}
