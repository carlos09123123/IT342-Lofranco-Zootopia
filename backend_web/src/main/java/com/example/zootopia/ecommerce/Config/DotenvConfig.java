package com.example.zootopia.ecommerce.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {
    static {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();
            
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("Loaded env: " + entry.getKey());
            });
        } catch (Exception e) {
            System.out.println("No .env file found or error loading it: " + e.getMessage());
        }
    }
}