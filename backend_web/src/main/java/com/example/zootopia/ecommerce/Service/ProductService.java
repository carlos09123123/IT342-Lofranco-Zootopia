package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.Product;
import com.example.zootopia.ecommerce.Repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepo.findById(id);
    }

    public Product createProduct(Product product) {
        System.out.println("=== Creating Product ===");
        System.out.println("Product Name: " + product.getProductName());
        System.out.println("Product Price: " + product.getProductPrice());
        System.out.println("Product Quantity: " + product.getQuantity());
        System.out.println("Product Type: " + product.getProductType());
        System.out.println("Product Description: " + product.getDescription());
        
        // Set default values if needed
        if (product.getQuantitySold() == 0) {
            product.setQuantitySold(0);
        }
        
        return productRepo.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> existingProduct = productRepo.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            if (productDetails.getProductName() != null) {
                product.setProductName(productDetails.getProductName());
            }
            if (productDetails.getDescription() != null) {
                product.setDescription(productDetails.getDescription());
            }
            if (productDetails.getProductPrice() != null) {
                product.setProductPrice(productDetails.getProductPrice());
            }
            product.setQuantity(productDetails.getQuantity());
            product.setQuantitySold(productDetails.getQuantitySold());
            if (productDetails.getProductImage() != null) {
                product.setProductImage(productDetails.getProductImage());
            }
            if (productDetails.getProductType() != null) {
                product.setProductType(productDetails.getProductType());
            }
            return productRepo.save(product);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }
}