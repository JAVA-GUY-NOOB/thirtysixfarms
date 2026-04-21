package com.farmcity.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.farmcity.entity.Advertisement;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    List<Advertisement> findByPositionAndIsActiveTrue(String position);

    List<Advertisement> findByIsActiveTrueOrderByPriorityDesc();

    @Query("SELECT a FROM Advertisement a WHERE a.isActive = true AND (a.startDate IS NULL OR a.startDate <= ?1) AND (a.endDate IS NULL OR a.endDate >= ?1) ORDER BY a.priority DESC")
    List<Advertisement> findActiveAds(LocalDateTime now);

    @Query("SELECT a FROM Advertisement a WHERE a.isActive = true AND a.position = ?1 AND (a.startDate IS NULL OR a.startDate <= ?2) AND (a.endDate IS NULL OR a.endDate >= ?2) ORDER BY a.priority DESC")
    List<Advertisement> findActiveAdsByPosition(String position, LocalDateTime now);

    List<Advertisement> findByAdType(String adType);
}
