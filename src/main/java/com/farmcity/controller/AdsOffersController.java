package com.farmcity.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.Advertisement;
import com.farmcity.entity.PromotionalOffer;
import com.farmcity.repository.AdvertisementRepository;
import com.farmcity.repository.PromotionalOfferRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AdsOffersController {

    private final AdvertisementRepository advertisementRepository;
    private final PromotionalOfferRepository promotionalOfferRepository;

    public AdsOffersController(AdvertisementRepository advertisementRepository,
                               PromotionalOfferRepository promotionalOfferRepository) {
        this.advertisementRepository = advertisementRepository;
        this.promotionalOfferRepository = promotionalOfferRepository;
    }

    // ==================== PUBLIC ENDPOINTS ====================

    @GetMapping("/ads/active")
    public ResponseEntity<List<Advertisement>> getActiveAds(
            @RequestParam(required = false) String position) {
        LocalDateTime now = LocalDateTime.now();
        List<Advertisement> ads;
        if (position != null && !position.isEmpty()) {
            ads = advertisementRepository.findActiveAdsByPosition(position, now);
        } else {
            ads = advertisementRepository.findActiveAds(now);
        }
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/offers/active")
    public ResponseEntity<List<PromotionalOffer>> getActiveOffers() {
        LocalDateTime now = LocalDateTime.now();
        List<PromotionalOffer> offers = promotionalOfferRepository.findActiveOffers(now);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/offers/homepage")
    public ResponseEntity<List<PromotionalOffer>> getHomepageOffers() {
        LocalDateTime now = LocalDateTime.now();
        List<PromotionalOffer> offers = promotionalOfferRepository.findActiveHomepageOffers(now);
        return ResponseEntity.ok(offers);
    }

    @PostMapping("/offers/validate")
    public ResponseEntity<Map<String, Object>> validatePromoCode(@RequestBody Map<String, Object> body) {
        String promoCode = (String) body.get("promoCode");
        Double orderAmount = ((Number) body.getOrDefault("orderAmount", 0)).doubleValue();

        Optional<PromotionalOffer> offerOpt = promotionalOfferRepository.findByPromoCode(promoCode);

        Map<String, Object> response = new HashMap<>();

        if (offerOpt.isEmpty()) {
            response.put("valid", false);
            response.put("message", "Invalid promo code");
            return ResponseEntity.ok(response);
        }

        PromotionalOffer offer = offerOpt.get();

        if (!offer.isCurrentlyActive()) {
            response.put("valid", false);
            response.put("message", "Promo code is not active or has expired");
            return ResponseEntity.ok(response);
        }

        if (orderAmount < offer.getMinimumOrderAmount()) {
            response.put("valid", false);
            response.put("message", "Order amount does not meet minimum requirement of KES " + offer.getMinimumOrderAmount());
            return ResponseEntity.ok(response);
        }

        double discount = offer.calculateDiscount(orderAmount);

        response.put("valid", true);
        response.put("offer", offer);
        response.put("discount", discount);
        response.put("finalAmount", orderAmount - discount);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/ads/{id}/click")
    public ResponseEntity<Void> recordAdClick(@PathVariable Long id) {
        Optional<Advertisement> adOpt = advertisementRepository.findById(id);
        if (adOpt.isPresent()) {
            Advertisement ad = adOpt.get();
            ad.setClicks(ad.getClicks() + 1);
            advertisementRepository.save(ad);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ads/{id}/impression")
    public ResponseEntity<Void> recordAdImpression(@PathVariable Long id) {
        Optional<Advertisement> adOpt = advertisementRepository.findById(id);
        if (adOpt.isPresent()) {
            Advertisement ad = adOpt.get();
            ad.setImpressions(ad.getImpressions() + 1);
            advertisementRepository.save(ad);
        }
        return ResponseEntity.ok().build();
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping("/admin/ads")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Advertisement>> getAllAds() {
        return ResponseEntity.ok(advertisementRepository.findAll());
    }

    @PostMapping("/admin/ads")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Advertisement> createAd(@RequestBody Advertisement ad) {
        Advertisement saved = advertisementRepository.save(ad);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/ads/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Advertisement> updateAd(@PathVariable Long id, @RequestBody Advertisement ad) {
        Optional<Advertisement> existing = advertisementRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ad.setId(id);
        Advertisement saved = advertisementRepository.save(ad);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/ads/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id) {
        advertisementRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/offers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionalOffer>> getAllOffers() {
        return ResponseEntity.ok(promotionalOfferRepository.findAll());
    }

    @PostMapping("/admin/offers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<? extends Object> createOffer(@RequestBody PromotionalOffer offer) {
        // Check for duplicate promo code
        if (offer.getPromoCode() != null && promotionalOfferRepository.existsByPromoCode(offer.getPromoCode())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Promo code already exists");
            return ResponseEntity.badRequest().body(error);
        }
        PromotionalOffer saved = promotionalOfferRepository.save(offer);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/offers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionalOffer> updateOffer(@PathVariable Long id, @RequestBody PromotionalOffer offer) {
        Optional<PromotionalOffer> existing = promotionalOfferRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        offer.setId(id);
        PromotionalOffer saved = promotionalOfferRepository.save(offer);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/offers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        promotionalOfferRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/ads/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdStats() {
        List<Advertisement> ads = advertisementRepository.findAll();

        int totalImpressions = ads.stream().mapToInt(Advertisement::getImpressions).sum();
        int totalClicks = ads.stream().mapToInt(Advertisement::getClicks).sum();
        double totalRevenue = ads.stream().mapToDouble(Advertisement::getRevenueGenerated).sum();

        double ctr = totalImpressions > 0 ? (double) totalClicks / totalImpressions * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAds", ads.size());
        stats.put("totalImpressions", totalImpressions);
        stats.put("totalClicks", totalClicks);
        stats.put("clickThroughRate", Math.round(ctr * 100.0) / 100.0);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }
}
