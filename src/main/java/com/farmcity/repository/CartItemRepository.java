package com.farmcity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
}
