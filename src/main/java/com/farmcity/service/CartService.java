package com.farmcity.service;

import java.util.List;

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
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long id, int quantity) {
        return cartItemRepository.findById(id).map(item -> {
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }).orElse(null);
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart(Long userId) {
        cartItemRepository.findByUserId(userId).forEach(item -> cartItemRepository.delete(item));
    }
}
