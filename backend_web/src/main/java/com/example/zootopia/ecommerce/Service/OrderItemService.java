package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.OrderItem;
import com.example.zootopia.ecommerce.Repository.OrderItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepo oirep;

    public List<OrderItem> getAllOrderItem() {
        return oirep.findAll();
    }

    public OrderItem postOrderItemRecord(OrderItem orderItem) {
        return oirep.save(orderItem);
    }

    public OrderItem putOrderItemDetails(Long id, OrderItem newOrderItemDetails) {
        Optional<OrderItem> existingOrderItem = oirep.findById(id);
        if (existingOrderItem.isPresent()) {
            OrderItem orderItem = existingOrderItem.get();
            orderItem.setQuantity(newOrderItemDetails.getQuantity());
            orderItem.setPrice(newOrderItemDetails.getPrice());
            orderItem.setIsRated(newOrderItemDetails.getIsRated());
            return oirep.save(orderItem);
        }
        return null;
    }

    public String deleteOrderItemDetails(Long id) {
        oirep.deleteById(id);
        return "Order item deleted successfully";
    }
}