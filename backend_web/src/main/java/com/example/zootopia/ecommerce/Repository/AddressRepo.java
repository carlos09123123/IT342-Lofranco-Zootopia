package com.example.zootopia.ecommerce.Repository;

import com.example.zootopia.ecommerce.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    Address findByUserUserId(Long userId);
}