package com.farmcity.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.farmcity.entity.PromotionalOffer;

@Repository
public interface PromotionalOfferRepository extends JpaRepository<PromotionalOffer, Long> {

    Optional<PromotionalOffer> findByPromoCode(String promoCode);

    List<PromotionalOffer> findByIsActiveTrueAndDisplayOnHomepageTrue();

    @Query("SELECT p FROM PromotionalOffer p WHERE p.isActive = true AND (p.startDate IS NULL OR p.startDate <= ?1) AND (p.endDate IS NULL OR p.endDate >= ?1) AND (p.usageLimit IS NULL OR p.usageCount < p.usageLimit)")
    List<PromotionalOffer> findActiveOffers(LocalDateTime now);

    @Query("SELECT p FROM PromotionalOffer p WHERE p.isActive = true AND p.displayOnHomepage = true AND (p.startDate IS NULL OR p.startDate <= ?1) AND (p.endDate IS NULL OR p.endDate >= ?1)")
    List<PromotionalOffer> findActiveHomepageOffers(LocalDateTime now);

    boolean existsByPromoCode(String promoCode);
}
