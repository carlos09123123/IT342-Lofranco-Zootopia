package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.Order;
import com.example.zootopia.ecommerce.Entity.OrderItem;
import com.example.zootopia.ecommerce.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orep;

    @Transactional
    public Order postOrderRecord(Order order) {
        // Set order items relationship
        if (order.getOrderItems() != null) {
            for (OrderItem orderItem : order.getOrderItems()) {
                orderItem.setOrder(order);
            }
        }
        
        // Set default values if not provided
        if (order.getOrderStatus() == null || order.getOrderStatus().isEmpty()) {
            order.setOrderStatus("PENDING");
        }
        if (order.getPaymentStatus() == null || order.getPaymentStatus().isEmpty()) {
            order.setPaymentStatus("PENDING");
        }
        if (order.getDescription() == null || order.getDescription().isEmpty()) {
            order.setDescription("Order from Zootopia");
        }
        if (order.getRemarks() == null) {
            order.setRemarks("");
        }
        if (order.getOrderDate() == null) {
            java.time.LocalDate currentDate = java.time.LocalDate.now();
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMMM d, yyyy");
            order.setOrderDate(currentDate.format(formatter));
        }
        
        // Save the order
        Order savedOrder = orep.save(order);
        System.out.println("Order saved with ID: " + savedOrder.getOrderId());
        System.out.println("Order status: " + savedOrder.getOrderStatus());
        System.out.println("Payment status: " + savedOrder.getPaymentStatus());
        
        return savedOrder;
    }

    public List<Order> getAllOrder() {
        return orep.findAll();
    }

    public Order getOrderDetails(Long orderID) {
        Optional<Order> order = orep.findById(orderID);
        return order.orElse(null);
    }

    public List<Order> getAllOrdersByUserId(Long userId) {
        return orep.findByUserUserId(userId);
    }

    public Double getTotalIncome() {
        List<Order> orders = orep.findAll();
        return orders.stream()
                .filter(o -> "COMPLETED".equals(o.getOrderStatus()) || "PAID".equals(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    @Transactional
    public Order putOrderDetails(Long id, Order newOrderDetails) {
        Optional<Order> existingOrderOpt = orep.findById(id);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            if (newOrderDetails.getOrderStatus() != null) {
                existingOrder.setOrderStatus(newOrderDetails.getOrderStatus());
            }
            if (newOrderDetails.getPaymentStatus() != null) {
                existingOrder.setPaymentStatus(newOrderDetails.getPaymentStatus());
            }
            if (newOrderDetails.getPaymentMethod() != null) {
                existingOrder.setPaymentMethod(newOrderDetails.getPaymentMethod());
            }
            if (newOrderDetails.getRemarks() != null) {
                existingOrder.setRemarks(newOrderDetails.getRemarks());
            }
            if (newOrderDetails.getDescription() != null) {
                existingOrder.setDescription(newOrderDetails.getDescription());
            }
            if (newOrderDetails.getTotalPrice() != null) {
                existingOrder.setTotalPrice(newOrderDetails.getTotalPrice());
            }
            return orep.save(existingOrder);
        }
        return null;
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Optional<Order> existingOrderOpt = orep.findById(id);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            String oldStatus = existingOrder.getOrderStatus();
            existingOrder.setOrderStatus(status);
            
            // Update payment status based on order status
            if (status.equals("COMPLETED") || status.equals("PAID")) {
                existingOrder.setPaymentStatus("PAID");
            } else if (status.equals("CANCELLED")) {
                existingOrder.setPaymentStatus("CANCELLED");
            } else if (status.equals("PENDING")) {
                existingOrder.setPaymentStatus("PENDING");
            } else if (status.equals("PROCESSING")) {
                existingOrder.setPaymentStatus("PENDING");
            } else if (status.equals("SHIPPED")) {
                existingOrder.setPaymentStatus("PENDING");
            } else if (status.equals("DELIVERED")) {
                existingOrder.setPaymentStatus("PAID");
            }
            
            Order updatedOrder = orep.save(existingOrder);
            System.out.println("Order " + id + " status updated from '" + oldStatus + "' to '" + status + "'");
            System.out.println("Payment status: " + updatedOrder.getPaymentStatus());
            
            return updatedOrder;
        }
        return null;
    }

    @Transactional
    public String deleteOrder(Long id) {
        if (orep.existsById(id)) {
            orep.deleteById(id);
            return "Order deleted successfully";
        }
        return "Order not found";
    }
}