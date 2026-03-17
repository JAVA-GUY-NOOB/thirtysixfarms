package com.farmcity.service;

import java.util.List;
import java.util.Objects;

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
        return reviewRepository.save(Objects.requireNonNull(review));
    }

    @Override
    public Review updateReview(Long id, Review review) {
        if (id == null || review == null) {
            return null;
        }
        return reviewRepository.findById(id)
                .map(existing -> {
                    if (review.getProductId() != null) {
                        existing.setProductId(review.getProductId());
                    }
                    if (review.getUserId() != null) {
                        existing.setUserId(review.getUserId());
                    }
                    if (review.getComment() != null) {
                        existing.setComment(review.getComment());
                    }
                    if (review.getRating() > 0) {
                        existing.setRating(review.getRating());
                    }
                    return reviewRepository.save(Objects.requireNonNull(existing));
                }).orElse(null);
    }

    @Override
    public void deleteReview(Long id) {
        if (id != null) {
            reviewRepository.deleteById(id);
        }
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        List<Review> list = reviewRepository.findByProductId(productId);
        if (list.isEmpty()) {
            return 0.0;
        }
        double sum = list.stream().mapToDouble(Review::getRating).sum();
        return sum / list.size();
    }
}
