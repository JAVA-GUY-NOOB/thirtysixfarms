package com.farmcity.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.farmcity.entity.CartItem;
import com.farmcity.repository.CartItemRepository;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> getCartItems(Long userId) {
        Objects.requireNonNull(userId, "userId is required");
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(CartItem cartItem) {
        return cartItemRepository.save(Objects.requireNonNull(cartItem));
    }

    public CartItem updateQuantity(Long id, int quantity) {
        Objects.requireNonNull(id, "id is required");
        return cartItemRepository.findById(id).map(item -> {
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }).orElse(null);
    }

    public void removeFromCart(Long id) {
        Objects.requireNonNull(id, "id is required");
        cartItemRepository.deleteById(id);
    }

    public void clearCart(Long userId) {
        Objects.requireNonNull(userId, "userId is required");
        cartItemRepository.findByUserId(userId).forEach(item -> cartItemRepository.delete(Objects.requireNonNull(item)));
    }
}
