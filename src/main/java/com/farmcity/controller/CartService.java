package com.farmcity.controller;

import com.farmcity.entity.CartItem;
import java.util.List;

public interface CartService {
    List<CartItem> getCartItems();
    CartItem addToCart(CartItem cartItem);
    CartItem updateQuantity(Long id, int quantity);
    void removeFromCart(Long id);
    void clearCart();
}
