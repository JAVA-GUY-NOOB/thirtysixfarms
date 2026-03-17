package com.farmcity.controller;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.CartItem;
import com.farmcity.entity.CustomerOrder;
import com.farmcity.entity.OrderItem;
import com.farmcity.repository.CustomerOrderRepository;
import com.farmcity.service.CartService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private final CustomerOrderRepository orderRepository;
    private final CartService cartService;
    private final SecureRandom random = new SecureRandom();

    public OrderController(CustomerOrderRepository orderRepository, CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }

    @GetMapping
    public List<CustomerOrder> list() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> get(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFromCart(@RequestBody(required = false) Map<String, Object> body, @org.springframework.web.bind.annotation.RequestParam(required = false) Long userId) {
        Long uid = userId == null ? 1L : userId;
        List<CartItem> items = cartService.getCartItems(uid);
        double total = 0.0;
        for (CartItem ci : items) {
            Double unitPrice = ci.getUnitPrice();
            Integer quantity = ci.getQuantity();
            if (unitPrice != null && quantity != null) {
                total += unitPrice * quantity;
            }
        }
        if (total <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart empty or invalid prices"));
        }
        CustomerOrder order = new CustomerOrder();
        order.setUserId(uid);
        order.setTotalAmount(total);
        order.setCurrency("KES");
        order.setReferenceCode(generateRef());
        order.setStatus("PENDING");

        List<OrderItem> orderItems = items.stream().map(ci -> {
            OrderItem item = new OrderItem();
            item.setProductId(ci.getProductId());
            item.setName(ci.getName());
            item.setImageUrl(ci.getImageUrl());
            item.setQuantity(ci.getQuantity());
            item.setUnitPrice(ci.getUnitPrice());
            item.setOrder(order);
            return item;
        }).toList();
        order.setItems(orderItems);
        orderRepository.save(order);
        cartService.clearCart(uid);
        Map<String, Object> resp = new HashMap<>();
        resp.put("orderId", order.getId());
        resp.put("reference", order.getReferenceCode());
        resp.put("amount", order.getTotalAmount());
        resp.put("currency", order.getCurrency());
        resp.put("status", order.getStatus());
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CustomerOrder> updateStatus(@PathVariable long id, @RequestBody Map<String, Object> body) {
        String status = body.getOrDefault("status", "PENDING").toString();
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    orderRepository.save(order);
                    return ResponseEntity.ok(order);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String generateRef() {
        return "ORD-" + random.nextInt(999999);
    }
}
