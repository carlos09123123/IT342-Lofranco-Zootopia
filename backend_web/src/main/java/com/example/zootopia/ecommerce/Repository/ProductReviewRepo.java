package com.example.zootopia.ecommerce.Repository;

import com.example.zootopia.ecommerce.Entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepo extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductProductId(Long productId);
}