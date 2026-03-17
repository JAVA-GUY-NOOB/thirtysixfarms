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

import com.farmcity.entity.CustomerOrder;
import com.farmcity.repository.CustomerOrderRepository;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    private final CustomerOrderRepository orderRepository;

    public PaymentController(CustomerOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

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

    @PostMapping("/process-order")
    public ResponseEntity<Map<String, Object>> processOrder(@RequestBody Map<String, Object> body) {
        Object totalObj = body.getOrDefault("total", body.getOrDefault("amount", 0));
        double total = 0.0;
        if (totalObj != null) {
            try {
                total = Double.parseDouble(totalObj.toString());
            } catch (NumberFormatException ignored) {
                total = 0.0;
            }
        }
        String currency = (String) body.getOrDefault("currency", "KES");
        CustomerOrder order = new CustomerOrder();
        order.setReferenceCode("ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));
        order.setTotalAmount(total);
        order.setCurrency(currency);
        order.setStatus("PROCESSING");
        orderRepository.save(order);
        Map<String, Object> resp = new HashMap<>();
        resp.put("orderId", order.getId());
        resp.put("reference", order.getReferenceCode());
        resp.put("status", order.getStatus());
        return ResponseEntity.ok(resp);
    }
}
