package com.example.zootopia.ecommerce.Controller;

import com.example.zootopia.ecommerce.Entity.Order;
import com.example.zootopia.ecommerce.Entity.OrderItem;
import com.example.zootopia.ecommerce.Entity.Address;
import com.example.zootopia.ecommerce.Service.OrderService;
import com.example.zootopia.ecommerce.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService oserv;
    
    @Autowired
    private AddressService addressService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Order service is working");
    }

    @PostMapping("/postOrderRecord")
    public ResponseEntity<?> postOrderRecord(@RequestBody Map<String, Object> requestBody) {
        try {
            System.out.println("=== ORDER RECEIVED ===");
            
            // Extract order data
            List<Map<String, Object>> orderItemsData = (List<Map<String, Object>>) requestBody.get("orderItems");
            String orderDate = (String) requestBody.get("orderDate");
            String orderStatus = (String) requestBody.get("orderStatus");
            String paymentMethod = (String) requestBody.get("paymentMethod");
            String paymentStatus = (String) requestBody.get("paymentStatus");
            Double totalPrice = ((Number) requestBody.get("totalPrice")).doubleValue();
            String description = (String) requestBody.get("description");
            String remarks = (String) requestBody.get("remarks");
            Map<String, Object> userData = (Map<String, Object>) requestBody.get("user");
            Long userId = ((Number) userData.get("userId")).longValue();
            
            // Extract address data if present
            Map<String, Object> addressData = (Map<String, Object>) requestBody.get("address");
            Address deliveryAddress = null;
            
            if (addressData != null) {
                deliveryAddress = new Address();
                deliveryAddress.setRegion((String) addressData.get("region"));
                deliveryAddress.setProvince((String) addressData.get("province"));
                deliveryAddress.setCity((String) addressData.get("city"));
                deliveryAddress.setBarangay((String) addressData.get("barangay"));
                deliveryAddress.setPostalCode((String) addressData.get("postalCode"));
                deliveryAddress.setStreetBuildingHouseNo((String) addressData.get("streetBuildingHouseNo"));
                
                // Save or get existing address for user
                Address existingAddress = addressService.getAddressByUserId(userId);
                if (existingAddress != null) {
                    // Update existing address
                    existingAddress.setRegion(deliveryAddress.getRegion());
                    existingAddress.setProvince(deliveryAddress.getProvince());
                    existingAddress.setCity(deliveryAddress.getCity());
                    existingAddress.setBarangay(deliveryAddress.getBarangay());
                    existingAddress.setPostalCode(deliveryAddress.getPostalCode());
                    existingAddress.setStreetBuildingHouseNo(deliveryAddress.getStreetBuildingHouseNo());
                    deliveryAddress = addressService.addOrUpdateAddressForUser(userId, existingAddress);
                } else {
                    // Create new address
                    deliveryAddress = addressService.addOrUpdateAddressForUser(userId, deliveryAddress);
                }
                
                System.out.println("Address saved with ID: " + deliveryAddress.getAddressId());
            }
            
            // Create Order object
            Order order = new Order();
            order.setOrderDate(orderDate);
            order.setOrderStatus(orderStatus);
            order.setPaymentMethod(paymentMethod);
            order.setPaymentStatus(paymentStatus);
            order.setTotalPrice(totalPrice);
            order.setDescription(description);
            order.setRemarks(remarks);
            
            // Set delivery address if available
            if (deliveryAddress != null) {
                order.setDeliveryAddress(deliveryAddress);
            }
            
            // Set user
            com.example.zootopia.ecommerce.Entity.User user = new com.example.zootopia.ecommerce.Entity.User();
            user.setUserId(userId);
            order.setUser(user);
            
            // Create OrderItems
            if (orderItemsData != null) {
                List<OrderItem> orderItems = new java.util.ArrayList<>();
                for (Map<String, Object> itemData : orderItemsData) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrderItemName((String) itemData.get("orderItemName"));
                    orderItem.setOrderItemImage((String) itemData.get("orderItemImage"));
                    orderItem.setPrice(((Number) itemData.get("price")).doubleValue());
                    orderItem.setQuantity(((Number) itemData.get("quantity")).intValue());
                    
                    // Set product ID if present
                    if (itemData.containsKey("productId")) {
                        Long productId = ((Number) itemData.get("productId")).longValue();
                        com.example.zootopia.ecommerce.Entity.Product product = new com.example.zootopia.ecommerce.Entity.Product();
                        product.setProductId(productId);
                        orderItem.setProduct(product);
                        orderItem.setProductId(productId);
                    }
                    
                    orderItem.setOrder(order);
                    orderItems.add(orderItem);
                }
                order.setOrderItems(orderItems);
            }
            
            System.out.println("Order Date: " + order.getOrderDate());
            System.out.println("Order Status: " + order.getOrderStatus());
            System.out.println("Payment Method: " + order.getPaymentMethod());
            System.out.println("Payment Status: " + order.getPaymentStatus());
            System.out.println("Total Price: " + order.getTotalPrice());
            System.out.println("Description: " + order.getDescription());
            System.out.println("User ID: " + userId);
            System.out.println("Order Items Count: " + (order.getOrderItems() != null ? order.getOrderItems().size() : 0));
            
            if (deliveryAddress != null) {
                System.out.println("Delivery Address ID: " + deliveryAddress.getAddressId());
            }
            
            Order savedOrder = oserv.postOrderRecord(order);
            System.out.println("Order saved with ID: " + savedOrder.getOrderId());
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            System.err.println("ERROR in postOrderRecord: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = oserv.getAllOrder();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("ERROR in getAllOrders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getOrderDetails/{orderID}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderID) {
        try {
            Order order = oserv.getOrderDetails(orderID);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with ID: " + orderID);
            }
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.err.println("ERROR in getOrderDetails: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching order: " + e.getMessage());
        }
    }

    @GetMapping("/getAllOrdersByUserId")
    public ResponseEntity<List<Order>> getAllOrdersByUserId(@RequestParam Long userId) {
        try {
            List<Order> orders = oserv.getAllOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("ERROR in getAllOrdersByUserId: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get-total-income")
    public ResponseEntity<Double> getTotalIncome() {
        try {
            Double total = oserv.getTotalIncome();
            return ResponseEntity.ok(total != null ? total : 0.0);
        } catch (Exception e) {
            System.err.println("ERROR in getTotalIncome: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/putOrderDetails/{id}")
    public ResponseEntity<?> putOrderDetails(@PathVariable Long id, @RequestBody Order newOrderDetails) {
        try {
            Order updatedOrder = oserv.putOrderDetails(id, newOrderDetails);
            if (updatedOrder == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with ID: " + id);
            }
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            System.err.println("ERROR in putOrderDetails: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating order: " + e.getMessage());
        }
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            System.out.println("Updating order " + id + " status to: " + status);
            Order updatedOrder = oserv.updateOrderStatus(id, status);
            if (updatedOrder == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with ID: " + id);
            }
            System.out.println("Order " + id + " status updated to: " + updatedOrder.getOrderStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            System.err.println("ERROR in updateOrderStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating order status: " + e.getMessage());
        }
    }

    @PutMapping("/markPaymentComplete/{orderId}")
    public ResponseEntity<?> markPaymentComplete(@PathVariable Long orderId) {
        try {
            System.out.println("Marking payment complete for order: " + orderId);
            Order updatedOrder = oserv.updateOrderStatus(orderId, "COMPLETED");
            if (updatedOrder != null) {
                System.out.println("Order " + orderId + " marked as COMPLETED/PAID");
                return ResponseEntity.ok(Map.of(
                    "success", true, 
                    "order", updatedOrder,
                    "message", "Payment marked as complete"
                ));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", "Order not found with ID: " + orderId
            ));
        } catch (Exception e) {
            System.err.println("ERROR in markPaymentComplete: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Error marking payment complete: " + e.getMessage()
                ));
        }
    }

    @DeleteMapping("/deleteOrderDetails/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        try {
            String result = oserv.deleteOrder(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("ERROR in deleteOrder: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting order: " + e.getMessage());
        }
    }
}