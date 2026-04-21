package com.farmcity.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Entity
public class PromotionalOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "discount_amount")
    private Double discountAmount;

    @Column(name = "minimum_order_amount")
    private Double minimumOrderAmount = 0.0;

    @Column(name = "max_discount")
    private Double maxDiscount;

    @Column(name = "promo_code", unique = true)
    private String promoCode;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "usage_limit")
    private Integer usageLimit; // null = unlimited

    @Column(name = "usage_count")
    private Integer usageCount = 0;

    @Column(name = "applicable_products")
    private String applicableProducts; // comma-separated product IDs, or "ALL"

    @Column(name = "offer_type")
    private String offerType; // PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING, BUY_ONE_GET_ONE

    @Column(name = "display_on_homepage")
    private Boolean displayOnHomepage = false;

    @Column(name = "banner_image_url")
    private String bannerImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getMinimumOrderAmount() { return minimumOrderAmount; }
    public void setMinimumOrderAmount(Double minimumOrderAmount) { this.minimumOrderAmount = minimumOrderAmount; }

    public Double getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(Double maxDiscount) { this.maxDiscount = maxDiscount; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getUsageCount() { return usageCount; }
    public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

    public String getApplicableProducts() { return applicableProducts; }
    public void setApplicableProducts(String applicableProducts) { this.applicableProducts = applicableProducts; }

    public String getOfferType() { return offerType; }
    public void setOfferType(String offerType) { this.offerType = offerType; }

    public Boolean getDisplayOnHomepage() { return displayOnHomepage; }
    public void setDisplayOnHomepage(Boolean displayOnHomepage) { this.displayOnHomepage = displayOnHomepage; }

    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isCurrentlyActive() {
        if (!isActive) return false;
        if (usageLimit != null && usageCount >= usageLimit) return false;
        LocalDateTime now = LocalDateTime.now();
        if (startDate != null && now.isBefore(startDate)) return false;
        if (endDate != null && now.isAfter(endDate)) return false;
        return true;
    }

    public Double calculateDiscount(double orderAmount) {
        if (!isCurrentlyActive()) return 0.0;
        if (orderAmount < minimumOrderAmount) return 0.0;

        double discount = 0.0;
        if ("PERCENTAGE".equals(offerType) && discountPercentage != null) {
            discount = orderAmount * (discountPercentage / 100);
        } else if ("FIXED_AMOUNT".equals(offerType) && discountAmount != null) {
            discount = discountAmount;
        }

        if (maxDiscount != null && discount > maxDiscount) {
            discount = maxDiscount;
        }

        return discount;
    }
}
