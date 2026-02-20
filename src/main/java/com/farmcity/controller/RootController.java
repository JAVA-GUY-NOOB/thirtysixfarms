package com.farmcity.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RootController {

    @GetMapping("/")
    public String welcome() {
        return "Farmcity API is running. See /api endpoints.";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
