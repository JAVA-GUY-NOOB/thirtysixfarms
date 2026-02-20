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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.CartItem;
import com.farmcity.entity.CustomerOrder;
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

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createFromCart(@RequestBody(required = false) Map<String, Object> body) {
        List<CartItem> items = cartService.getCartItems();
        @SuppressWarnings("UnnecessaryUnboxing")
        int total = items.stream().mapToInt(ci -> (ci.getPrice() == null ? 0 : ci.getPrice().intValue()) * ci.getQuantity()).sum();
        if (total <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart empty or invalid prices"));
        }
        CustomerOrder order = new CustomerOrder();
        order.setAmount(total);
        order.setCurrency("KES");
        order.setReferenceCode(generateRef());
        order.setStatus("PENDING");
        orderRepository.save(order);
        // Optionally clear cart after order creation
        cartService.clearCart();
        Map<String, Object> resp = new HashMap<>();
        resp.put("orderId", order.getId());
        resp.put("reference", order.getReferenceCode());
        resp.put("amount", order.getAmount());
        resp.put("currency", order.getCurrency());
        resp.put("status", order.getStatus());
        return ResponseEntity.ok(resp);
    }

    private String generateRef() {
        return "ORD-" + random.nextInt(999999);
    }
}
