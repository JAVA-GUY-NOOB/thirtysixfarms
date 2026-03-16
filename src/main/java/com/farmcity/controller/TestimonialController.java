package com.farmcity.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "http://localhost:3000")
public class TestimonialController {
    private final List<Map<String, Object>> testimonials = new ArrayList<>();

    public TestimonialController() {
        testimonials.add(Map.of("id", 1, "name", "Maria", "rating", 5, "comment", "Great service!"));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(testimonials);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Map<String, Object> record = Map.of(
                "id", testimonials.size() + 1,
                "name", body.getOrDefault("name", "Anonymous"),
                "rating", body.getOrDefault("rating", 5),
                "comment", body.getOrDefault("comment", "")
        );
        testimonials.add(record);
        return ResponseEntity.ok(record);
    }
}
