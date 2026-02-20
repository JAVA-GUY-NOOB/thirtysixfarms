package com.farmcity.service;

import com.farmcity.entity.CartItem;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {
    private final List<CartItem> cartItems = new ArrayList<>();

    public List<CartItem> getCartItems() {
        return new ArrayList<>(cartItems);
    }

    public CartItem addToCart(CartItem cartItem) {
        cartItems.add(cartItem);
        return cartItem;
    }

    public CartItem updateQuantity(Long id, int quantity) {
        for (CartItem item : cartItems) {
            if (item.getId().equals(id)) {
                item.setQuantity(quantity);
                return item;
            }
        }
        return null;
    }

    public void removeFromCart(Long id) {
        cartItems.removeIf(item -> item.getId().equals(id));
    }

    public void clearCart() {
        cartItems.clear();
    }
}
