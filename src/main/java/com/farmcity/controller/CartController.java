package com.farmcity.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.CartItem;
import com.farmcity.service.CartService;
import com.farmcity.repository.RiceProductRepository;
import com.farmcity.model.RiceProduct;

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
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartService.getCartItems());
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> body) {
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
        CartItem cartItem = new CartItem(product.getId(), product.getName(), quantity, product.getPrice().intValue());
        return ResponseEntity.ok(cartService.addToCart(cartItem));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long id, 
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(id, quantity));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
