package com.farmcity.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.CartItem;
import com.farmcity.model.RiceProduct;
import com.farmcity.repository.RiceProductRepository;
import com.farmcity.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final RiceProductRepository riceProductRepository;

    public CartController(CartService cartService, RiceProductRepository riceProductRepository) {
        this.cartService = cartService;
        this.riceProductRepository = riceProductRepository;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@RequestParam(required = false) Long userId) {
        Long uid = userId == null ? 1L : userId;
        return ResponseEntity.ok(cartService.getCartItems(uid));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> body, @RequestParam(required = false) Long userId) {
        Long uid = userId == null ? 1L : userId;
        Long productId = null;
        int quantity = 1;
        if (body.get("productId") != null) {
            productId = Long.valueOf(body.get("productId").toString());
        }
        if (body.get("quantity") != null) {
            quantity = Integer.parseInt(body.get("quantity").toString());
        }
        if (productId == null) {
            return ResponseEntity.badRequest().build();
        }
        RiceProduct product = riceProductRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().build();
        }
        CartItem cartItem = new CartItem(product.getId(), product.getName(), product.getImageUrl(), quantity, product.getPrice(), uid);
        return ResponseEntity.ok(cartService.addToCart(cartItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        int quantity = 1;
        if (body.get("quantity") != null) {
            quantity = Integer.parseInt(body.get("quantity").toString());
        }
        CartItem updated = cartService.updateQuantity(id, quantity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam(required = false) Long userId) {
        Long uid = userId == null ? 1L : userId;
        cartService.clearCart(uid);
        return ResponseEntity.noContent().build();
    }
}
