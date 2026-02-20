package com.farmcity.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.service.MpesaService;

@RestController
@RequestMapping("/api/mpesa")
@CrossOrigin(origins = "http://localhost:3000")
public class MpesaController {

    private final MpesaService mpesaService;

    public MpesaController(MpesaService mpesaService) {
        this.mpesaService = mpesaService;
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, Object>> token() {
        String token = mpesaService.getAccessToken();
        Map<String, Object> resp = new HashMap<>();
        resp.put("access_token", token);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/stkpush")
    public ResponseEntity<?> stkPush(@RequestBody Map<String, Object> payload) {
        String phone = (String) payload.getOrDefault("phone","254700000000");
        int amount = ((Number) payload.getOrDefault("amount", 1)).intValue();
        String reference = (String) payload.getOrDefault("reference", "ORDER");
        String desc = (String) payload.getOrDefault("description", "Payment");
        Map<String, Object> resp = mpesaService.stkPush(phone, amount, reference, desc);
        return ResponseEntity.ok(resp);
    }

    // Callback endpoint that Safaricom will POST result to
    @PostMapping("/callback")
    public ResponseEntity<Map<String, Object>> callback(@RequestBody(required = false) Map<String, Object> body) {
        mpesaService.processCallback(body);
        Map<String, Object> ack = new HashMap<>();
        ack.put("ResultCode", 0);
        ack.put("ResultDesc", "Accepted");
        return ResponseEntity.ok(ack);
    }

    @GetMapping("/status/{checkoutRequestId}")
    public ResponseEntity<Map<String, Object>> status(@PathVariable String checkoutRequestId) {
        Map<String, Object> status = mpesaService.getStatus(checkoutRequestId);
        if (status.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(status);
    }
}
