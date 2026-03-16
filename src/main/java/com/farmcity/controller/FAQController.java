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
@RequestMapping("/api/faqs")
@CrossOrigin(origins = "http://localhost:3000")
public class FAQController {
    private final List<Map<String, Object>> faqs = new ArrayList<>();

    public FAQController() {
        faqs.add(Map.of("id", 1, "question", "How do I order?", "answer", "Add items to cart and checkout."));
        faqs.add(Map.of("id", 2, "question", "Do you deliver?", "answer", "Yes, we deliver in Nairobi and suburbs."));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFaqs() {
        return ResponseEntity.ok(faqs);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFaq(@RequestBody Map<String, Object> body) {
        int nextId = faqs.size() + 1;
        Map<String, Object> faq = Map.of(
                "id", nextId,
                "question", body.getOrDefault("question", ""),
                "answer", body.getOrDefault("answer", "")
        );
        faqs.add(faq);
        return ResponseEntity.ok(faq);
    }
}
