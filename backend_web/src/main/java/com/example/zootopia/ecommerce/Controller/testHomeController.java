package com.example.zootopia.ecommerce.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testHomeController {
    @GetMapping("/")
    public String home() {
        return "Zootopia backend is live! 🐾";
    }
}
