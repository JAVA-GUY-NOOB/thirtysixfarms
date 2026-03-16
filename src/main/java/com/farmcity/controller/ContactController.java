package com.farmcity.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {
    private final List<Map<String, Object>> messages = new ArrayList<>();

    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@RequestBody Map<String, Object> body) {
        String name = (String) body.getOrDefault("name", "");
        String email = (String) body.getOrDefault("email", "");
        String message = (String) body.getOrDefault("message", "");
        if (name.isBlank() || email.isBlank() || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, email, and message are required."));
        }
        Map<String, Object> record = Map.of("name", name, "email", email, "message", message);
        messages.add(record);
        return ResponseEntity.ok(Map.of("success", true, "received", record));
    }
}
