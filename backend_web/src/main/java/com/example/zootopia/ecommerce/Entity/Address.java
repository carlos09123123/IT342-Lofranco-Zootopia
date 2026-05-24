package com.example.zootopia.ecommerce.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "address")  // Changed from "addresses" to "address"
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    private String region;
    private String province;
    private String city;
    private String barangay;
    private String postalCode;
    private String streetBuildingHouseNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @OneToOne(mappedBy = "deliveryAddress")
    private Order order;

    // Constructors
    public Address() {}

    public Address(String region, String province, String city, String barangay, 
                   String postalCode, String streetBuildingHouseNo) {
        this.region = region;
        this.province = province;
        this.city = city;
        this.barangay = barangay;
        this.postalCode = postalCode;
        this.streetBuildingHouseNo = streetBuildingHouseNo;
    }

    // Getters and Setters
    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getBarangay() {
        return barangay;
    }

    public void setBarangay(String barangay) {
        this.barangay = barangay;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getStreetBuildingHouseNo() {
        return streetBuildingHouseNo;
    }

    public void setStreetBuildingHouseNo(String streetBuildingHouseNo) {
        this.streetBuildingHouseNo = streetBuildingHouseNo;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}