package com.farmcity.controller;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsletterController {
    private final Set<String> subscribers = new HashSet<>();

    @GetMapping
    public ResponseEntity<Set<String>> getSubscribers() {
        return ResponseEntity.ok(subscribers);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, Object> body) {
        String email = (String) body.getOrDefault("email", "");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        subscribers.add(email.trim().toLowerCase());
        return ResponseEntity.ok(Map.of("success", true, "email", email));
    }
}
