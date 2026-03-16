package com.farmcity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.model.RiceProduct;

public interface RiceProductRepository extends JpaRepository<RiceProduct, Long> {
    List<RiceProduct> findByAvailableTrue();
    List<RiceProduct> findByCategoryIgnoreCase(String category);
    List<RiceProduct> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
