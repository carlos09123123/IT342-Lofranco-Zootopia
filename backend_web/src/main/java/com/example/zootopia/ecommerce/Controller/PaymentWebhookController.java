package com.example.zootopia.ecommerce.Controller;

import com.example.zootopia.ecommerce.Entity.Order;
import com.example.zootopia.ecommerce.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment-webhook")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentWebhookController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/paymongo")
    public ResponseEntity<?> handlePayMongoWebhook(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("=== WEBHOOK RECEIVED ===");
            System.out.println("Payload: " + payload);
            
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data != null) {
                Map<String, Object> attributes = (Map<String, Object>) data.get("attributes");
                if (attributes != null) {
                    String referenceNumber = (String) attributes.get("reference_number");
                    String status = (String) attributes.get("status");
                    
                    System.out.println("Reference Number: " + referenceNumber);
                    System.out.println("Payment Status: " + status);
                    
                    if (referenceNumber != null && referenceNumber.startsWith("ORDER-")) {
                        String orderIdStr = referenceNumber.substring(6);
                        Long orderId = Long.parseLong(orderIdStr);
                        
                        if ("paid".equals(status)) {
                            Order updatedOrder = orderService.updateOrderStatus(orderId, "COMPLETED");
                            System.out.println("Order " + orderId + " marked as COMPLETED/PAID");
                            return ResponseEntity.ok(Map.of("status", "success", "orderId", orderId));
                        }
                    }
                }
            }
            
            return ResponseEntity.ok(Map.of("status", "received"));
        } catch (Exception e) {
            System.err.println("Webhook error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}