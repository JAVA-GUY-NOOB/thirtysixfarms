package com.farmcity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.entity.CustomerOrder;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByReferenceCode(String referenceCode);
}
