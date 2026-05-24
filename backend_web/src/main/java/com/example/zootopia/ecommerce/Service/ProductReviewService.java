package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.Product;
import com.example.zootopia.ecommerce.Entity.ProductReview;
import com.example.zootopia.ecommerce.Repository.ProductRepo;
import com.example.zootopia.ecommerce.Repository.ProductReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepo reviewRepo;

    @Autowired
    private ProductRepo productRepo;

    public List<ProductReview> getAllReviews() {
        return reviewRepo.findAll();
    }

    public List<ProductReview> getReviewsByProductId(Long productId) {
        return reviewRepo.findByProductProductId(productId);
    }

    public ProductReview saveReview(ProductReview review) {
        if (review.getProduct() != null && review.getProduct().getProductId() != null) {
            Long productId = review.getProduct().getProductId();
            Optional<Product> productOpt = productRepo.findById(productId);
            if (productOpt.isPresent()) {
                return reviewRepo.save(review);
            }
        }
        return null;
    }

    public ProductReview updateReview(Long id, ProductReview reviewDetails) {
        Optional<ProductReview> existingReview = reviewRepo.findById(id);
        if (existingReview.isPresent()) {
            ProductReview review = existingReview.get();
            if (reviewDetails.getRatings() != null) {
                review.setRatings(reviewDetails.getRatings());
            }
            if (reviewDetails.getComment() != null) {
                review.setComment(reviewDetails.getComment());
            }
            return reviewRepo.save(review);
        }
        return null;
    }

    public void deleteReview(Long id) {
        reviewRepo.deleteById(id);
    }
}