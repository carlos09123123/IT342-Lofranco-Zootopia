package com.example.zootopia.ecommerce.Controller;

import com.example.zootopia.ecommerce.Entity.Address;
import com.example.zootopia.ecommerce.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/addAddress")
    public ResponseEntity<?> addAddress(@RequestBody Address address, @RequestHeader("Authorization") String authHeader) {
        try {
            // Get user ID from token (you can extract from JWT)
            // For now, let's get it from the request or session
            Long userId = extractUserIdFromToken(authHeader);
            
            Address savedAddress = addressService.addOrUpdateAddressForUser(userId, address);
            return ResponseEntity.ok(savedAddress);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/getAddress")
    public ResponseEntity<?> getAddress(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            Address address = addressService.getAddressByUserId(userId);
            return ResponseEntity.ok(address);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    private Long extractUserIdFromToken(String authHeader) {
        // You should implement proper JWT token extraction here
        // For now, return a default or get from context
        // This is a placeholder - you should use your JWT utility
        return 1L; // Replace with actual user ID extraction
    }
}