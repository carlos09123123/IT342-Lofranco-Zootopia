package com.example.zootopia.ecommerce.Repository;

import com.example.zootopia.ecommerce.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository <Admin, Long> {

    Optional<Admin> findByUsernameAndPassword(String username, String password);
    Optional<Admin> findByUsername(String username);
    boolean existsByUsername(String username);
}
