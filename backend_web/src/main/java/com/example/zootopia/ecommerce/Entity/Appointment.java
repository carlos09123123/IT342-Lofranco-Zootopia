package com.example.zootopia.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appId;

    private String email;
    private String contactNo;
    private String date;
    private String time;
    private String groomService;
    private double price;
    private boolean confirmed;
    private boolean canceled;

    @ManyToOne
    @JoinColumn(name = "id")
    private User user;
}