package com.example.zootopia.ecommerce.Repository;

import com.example.zootopia.ecommerce.Entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

}