package com.example.zootopia.ecommerce.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${paymongo.secret-key}")
    private String paymongoSecretKey;

    private static final String PAYMONGO_API_URL = "https://api.paymongo.com/v1/checkout_sessions";

    @PostMapping("/create-payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> paymentData) {
        try {
            // Log received data
            System.out.println("=== Payment Request Received ===");
            System.out.println("Payment Data: " + paymentData);
            
            Object orderIdObj = paymentData.get("orderId");
            Object amountObj = paymentData.get("amount");
            String description = (String) paymentData.get("description");
            String successUrl = (String) paymentData.get("successUrl");
            String failedUrl = (String) paymentData.get("failedUrl");
            
            if (orderIdObj == null) {
                System.err.println("ERROR: orderId is null!");
                return ResponseEntity.badRequest().body(Map.of("error", "orderId is required"));
            }
            
            String orderId = orderIdObj.toString();
            Double amount = amountObj instanceof Integer ? ((Integer) amountObj).doubleValue() : (Double) amountObj;
            
            System.out.println("Order ID: " + orderId);
            System.out.println("Amount: PHP " + amount);
            System.out.println("Description: " + description);
            
            // Prepare PayMongo request
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Set Basic Auth
            String auth = paymongoSecretKey + ":";
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            Map<String, Object> attributes = new HashMap<>();
            Map<String, Object> lineItem = new HashMap<>();
            
            lineItem.put("name", description);
            lineItem.put("quantity", 1);
            lineItem.put("amount", Math.round(amount * 100));
            lineItem.put("currency", "PHP");
            
            attributes.put("send_email_receipt", false);
            attributes.put("show_description", true);
            attributes.put("show_line_items", true);
            attributes.put("payment_method_types", new String[]{"gcash", "card"});
            attributes.put("line_items", new Object[]{lineItem});
            attributes.put("success_url", successUrl);
            attributes.put("cancel_url", failedUrl);
            attributes.put("description", description);
            attributes.put("reference_number", "ORDER-" + orderId);
            
            data.put("attributes", attributes);
            requestBody.put("data", data);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            System.out.println("Sending request to PayMongo API...");
            
            ResponseEntity<Map> response = restTemplate.exchange(
                PAYMONGO_API_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            System.out.println("PayMongo Response Status: " + response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                Map<String, Object> responseData = (Map<String, Object>) responseBody.get("data");
                Map<String, Object> responseAttributes = (Map<String, Object>) responseData.get("attributes");
                String checkoutUrl = (String) responseAttributes.get("checkout_url");
                
                Map<String, String> result = new HashMap<>();
                result.put("checkoutUrl", checkoutUrl);
                result.put("referenceNumber", "ORDER-" + orderId);
                
                System.out.println("Payment link created: " + checkoutUrl);
                return ResponseEntity.ok(result);
            } else {
                System.err.println("PayMongo Error Response: " + response.getBody());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create payment link", "details", response.getBody()));
            }
        } catch (Exception e) {
            System.err.println("Exception in createPaymentLink: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error creating payment link: " + e.getMessage()));
        }
    }
}