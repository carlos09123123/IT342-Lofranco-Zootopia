package com.example.zootopia.ecommerce.Service;

import com.example.zootopia.ecommerce.Entity.Address;
import com.example.zootopia.ecommerce.Entity.Cart;
import com.example.zootopia.ecommerce.Entity.User;
import com.example.zootopia.ecommerce.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    // register new user
    public String signUp(User user) {
        Optional<User> existingUser = userRepo.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return "Username already registered!";
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        if (user.getCart() == null) {
            Cart cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully!";
    }

    public List<User> findAll() {
        return userRepo.findAll();
    }

    public Map<String, Object> verify(User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            if (authentication.isAuthenticated()) {
                Optional<User> foundUser = userRepo.findByUsername(user.getUsername());

                if (foundUser.isPresent()) {
                    User actualUser = foundUser.get();
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", jwtService.generateToken(user.getUsername()));
                    response.put("userId", actualUser.getUserId());
                    response.put("username", actualUser.getUsername());
                    response.put("email", actualUser.getEmail());
                    return response;
                }
            }
            return Collections.singletonMap("error", "unauthorized");
        } catch (AuthenticationException e) {
            return Collections.singletonMap("error", "failed");
        }
    }

    // find user by id
    public Optional<User> findById(Long id) {
        return userRepo.findById(id);
    }

    // update address
    public void updateAddress(Long userId, Address address) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Address existingAddress = user.getAddress();

        if (existingAddress != null) {
            existingAddress.setRegion(address.getRegion());
            existingAddress.setProvince(address.getProvince());
            existingAddress.setCity(address.getCity());
            existingAddress.setBarangay(address.getBarangay());
            existingAddress.setPostalCode(address.getPostalCode());
            existingAddress.setStreetBuildingHouseNo(address.getStreetBuildingHouseNo());
        } else {
            address.setUser(user);
            user.setAddress(address);
        }

        userRepo.save(user);
    }

    // Update user information
    public String updateUser(Long userId, User updatedUser) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
            Optional<User> userWithSameUsername = userRepo.findByUsername(updatedUser.getUsername());
            if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getUserId().equals(userId)) {
                return "Username already taken by another user!";
            }
            existingUser.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            Optional<User> userWithSameEmail = userRepo.findByEmail(updatedUser.getEmail());
            if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getUserId().equals(userId)) {
                return "Email already registered by another user!";
            }
            existingUser.setEmail(updatedUser.getEmail());
        }

        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }

        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }

        if (updatedUser.getRole() != null && !updatedUser.getRole().isEmpty()) {
            existingUser.setRole(updatedUser.getRole());
        }

        userRepo.save(existingUser);
        return "User updated successfully!";
    }

    // Delete user
    public String deleteUser(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }
        userRepo.deleteById(userId);
        return "User deleted successfully!";
    }

    // Find user by email (needed for OAuth login)
    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    // Save OAuth user - FIXED: Changed setAuthProvider to setProvider
    public User saveOAuthUser(String email, String name, String googleId) {
        User existingUser = findByEmail(email);

        if (existingUser != null) {
            if (existingUser.getGoogleId() == null) {
                existingUser.setGoogleId(googleId);
                existingUser.setProvider("GOOGLE");  // FIXED: was setAuthProvider
                return userRepo.save(existingUser);
            }
            return existingUser;
        } else {
            User newUser = new User();
            newUser.setEmail(email);

            String usernameFromEmail = email.split("@")[0];
            String uniqueUsername = usernameFromEmail;
            int counter = 1;

            while (userRepo.findByUsername(uniqueUsername).isPresent()) {
                uniqueUsername = usernameFromEmail + counter++;
            }

            newUser.setUsername(uniqueUsername);

            if (name != null && name.contains(" ")) {
                String[] nameParts = name.split(" ", 2);
                newUser.setFirstName(nameParts[0]);
                newUser.setLastName(nameParts[1]);
            } else {
                newUser.setFirstName(name);
                newUser.setLastName("");
            }

            newUser.setGoogleId(googleId);
            newUser.setProvider("GOOGLE");  // FIXED: was setAuthProvider
            newUser.setRole("CUSTOMER");

            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            Cart cart = new Cart();
            cart.setUser(newUser);
            newUser.setCart(cart);

            return userRepo.save(newUser);
        }
    }

    // Update a user
    public User updateUser(User user) {
        return userRepo.save(user);
    }
}