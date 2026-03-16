package com.farmcity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
