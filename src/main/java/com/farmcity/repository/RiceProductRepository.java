package com.farmcity.repository;

import com.farmcity.model.RiceProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RiceProductRepository extends JpaRepository<RiceProduct, Long> {
    List<RiceProduct> findByAvailableTrue();
}
