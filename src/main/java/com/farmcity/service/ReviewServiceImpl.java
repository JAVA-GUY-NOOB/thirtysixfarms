package com.farmcity.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.farmcity.entity.Review;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public Review getReviewById(Long id) {
        if (id == null) {
            return null;
        }
        return reviewRepository.findById(id).orElse(null);
    }

    @Override
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public Review createReview(Review review) {
        if (review == null) {
            return null;
        }
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long id, Review review) {
        // update logic
        return null;
    }

    @Override
    public void deleteReview(Long id) {
        if (id != null) {
            reviewRepository.deleteById(id);
        }
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        // average rating logic
        return null;
    }
}
