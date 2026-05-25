package com.example.zootopia.ecommerce.Controller;

import com.example.zootopia.ecommerce.Entity.OrderItem;
import com.example.zootopia.ecommerce.Service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderItem")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    @Autowired
    private OrderItemService oiserv;

    @GetMapping("/getAllOrdersItem")
    public List<OrderItem> getAllOrderItem() {
        return oiserv.getAllOrderItem();
    }

    @PostMapping("/postOrderItemRecord")
    public OrderItem postOrderItemRecord(@RequestBody OrderItem orderItem) {
        return oiserv.postOrderItemRecord(orderItem);
    }

    @PutMapping("/putOrderItemDetails/{id}")
    public OrderItem putOrderItemDetails(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        return oiserv.putOrderItemDetails(id, orderItem);
    }

    @DeleteMapping("/deleteOrderItemDetails/{id}")
    public String deleteOrderItemDetails(@PathVariable Long id) {
        return oiserv.deleteOrderItemDetails(id);
    }
}