package com.farmcity.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @PostMapping("/intent")
    public ResponseEntity<Map<String, Object>> createIntent(@RequestBody Map<String, Object> payload) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("clientSecret", UUID.randomUUID().toString());
        resp.put("amount", payload.getOrDefault("amount", 0));
        resp.put("currency", payload.getOrDefault("currency", "USD"));
        resp.put("status", "created");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirm(@RequestBody Map<String, Object> payload) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("paymentId", payload.getOrDefault("clientSecret", UUID.randomUUID().toString()));
        resp.put("status", "succeeded");
        return ResponseEntity.ok(resp);
    }
}
