package com.farmcity.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.config.JwtUtil;
import com.farmcity.entity.UserAccount;
import com.farmcity.repository.UserAccountRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody Map<String, Object> body) {
        String username = (String) body.getOrDefault("username", "");
        String password = (String) body.getOrDefault("password", "");
        String email = (String) body.getOrDefault("email", "");
        String firstName = (String) body.getOrDefault("firstName", "");
        String lastName = (String) body.getOrDefault("lastName", "");
        String phoneNumber = (String) body.getOrDefault("phoneNumber", "");

        if (username.isBlank() || password.isBlank() || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Username, password, and email are required",
                "success", false
            ));
        }

        // Validate email format
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid email format",
                "success", false
            ));
        }

        // Check if username exists
        Optional<UserAccount> existingUser = userAccountRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Username already exists",
                "success", false
            ));
        }

        // Check if email exists
        Optional<UserAccount> existingEmail = userAccountRepository.findByEmail(email);
        if (existingEmail.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email already registered",
                "success", false
            ));
        }

        // Create new user
        UserAccount user = new UserAccount();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        user.setRole("USER");
        user.setIsActive(true);

        userAccountRepository.save(user);

        // Generate JWT token
        String token = JwtUtil.generateToken(username);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "role", user.getRole()
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        String username = (String) body.getOrDefault("username", "");
        String password = (String) body.getOrDefault("password", "");

        if (username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Username and password are required",
                "success", false
            ));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            UserAccount user = userAccountRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userAccountRepository.save(user);

            // Generate JWT token
            String token = JwtUtil.generateToken(username);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "role", user.getRole(),
                "phoneNumber", user.getPhoneNumber()
            ));

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid credentials",
                "success", false
            ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid token",
                "success", false
            ));
        }

        String token = authHeader.substring(7);
        String username = JwtUtil.extractUsername(token);

        if (!JwtUtil.validateToken(token, username)) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid or expired token",
                "success", false
            ));
        }

        Optional<UserAccount> userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "User not found",
                "success", false
            ));
        }

        UserAccount user = userOpt.get();

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("phoneNumber", user.getPhoneNumber());
        userMap.put("role", user.getRole());
        userMap.put("deliveryAddress", user.getDeliveryAddress());
        userMap.put("city", user.getCity());
        userMap.put("county", user.getCounty());
        userMap.put("latitude", user.getLatitude());
        userMap.put("longitude", user.getLongitude());
        userMap.put("createdAt", user.getCreatedAt());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userMap);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid token",
                "success", false
            ));
        }

        String token = authHeader.substring(7);
        String username = JwtUtil.extractUsername(token);

        if (!JwtUtil.validateToken(token, username)) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid or expired token",
                "success", false
            ));
        }

        Optional<UserAccount> userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                "error", "User not found",
                "success", false
            ));
        }

        UserAccount user = userOpt.get();

        // Update fields if provided
        if (body.containsKey("firstName")) {
            user.setFirstName((String) body.get("firstName"));
        }
        if (body.containsKey("lastName")) {
            user.setLastName((String) body.get("lastName"));
        }
        if (body.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) body.get("phoneNumber"));
        }
        if (body.containsKey("deliveryAddress")) {
            user.setDeliveryAddress((String) body.get("deliveryAddress"));
        }
        if (body.containsKey("city")) {
            user.setCity((String) body.get("city"));
        }
        if (body.containsKey("county")) {
            user.setCounty((String) body.get("county"));
        }
        if (body.containsKey("latitude")) {
            user.setLatitude(((Number) body.get("latitude")).doubleValue());
        }
        if (body.containsKey("longitude")) {
            user.setLongitude(((Number) body.get("longitude")).doubleValue());
        }

        userAccountRepository.save(user);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("phoneNumber", user.getPhoneNumber());
        userMap.put("deliveryAddress", user.getDeliveryAddress());
        userMap.put("city", user.getCity());
        userMap.put("county", user.getCounty());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", userMap);

        return ResponseEntity.ok(response);
    }
}
