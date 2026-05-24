package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.Address;
import com.example.zootopia.ecommerce.Entity.User;
import com.example.zootopia.ecommerce.Repository.AddressRepo;
import com.example.zootopia.ecommerce.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressService {
    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;

    @Transactional
    public Address addOrUpdateAddressForUser(Long userId, Address address) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Address existingAddress = addressRepo.findByUserUserId(userId);
        
        if (existingAddress != null) {
            // Update existing address
            existingAddress.setRegion(address.getRegion());
            existingAddress.setProvince(address.getProvince());
            existingAddress.setCity(address.getCity());
            existingAddress.setBarangay(address.getBarangay());
            existingAddress.setPostalCode(address.getPostalCode());
            existingAddress.setStreetBuildingHouseNo(address.getStreetBuildingHouseNo());
            return addressRepo.save(existingAddress);
        }

        // Create new address
        address.setUser(user);
        return addressRepo.save(address);
    }

    public Address getAddressByUserId(Long userId) {
        return addressRepo.findByUserUserId(userId);
    }

    @Transactional
    public void deleteAddressForUser(Long userId) {
        Address address = addressRepo.findByUserUserId(userId);
        if (address != null) {
            addressRepo.delete(address);
        }
    }
}