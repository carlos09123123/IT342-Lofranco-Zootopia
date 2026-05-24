package com.example.zootopia.ecommerce.Config;

import com.example.zootopia.ecommerce.Entity.User;
import com.example.zootopia.ecommerce.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String firstName = oauth2User.getAttribute("given_name");
            String lastName = oauth2User.getAttribute("family_name");
            String googleId = oauth2User.getAttribute("sub");

            System.out.println("=== Google OAuth2 Login Success ===");
            System.out.println("Email: " + email);
            System.out.println("Name: " + name);

            // Check if user exists
            Optional<User> existingUser = userRepo.findByEmail(email);
            User user;
            
            if (existingUser.isPresent()) {
                user = existingUser.get();
                System.out.println("Existing user found: " + user.getUsername());
            } else {
                user = new User();
                user.setEmail(email);
                user.setUsername(email.split("@")[0]);
                user.setFirstName(firstName != null ? firstName : (name != null ? name.split(" ")[0] : "Google"));
                user.setLastName(lastName != null ? lastName : (name != null && name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "User"));
                user.setRole("CUSTOMER");
                user.setProvider("GOOGLE");
                user.setGoogleId(googleId);
                user.setPassword("");  // FIXED: Set empty password for OAuth users
                userRepo.save(user);
                System.out.println("Created new user: " + user.getUsername());
            }

            // Generate token
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", email);
            claims.put("userId", user.getUserId());
            claims.put("role", user.getRole());
            claims.put("username", user.getUsername());

            String token = jwtUtil.generateTokenForOAuth2User(user.getUsername(), claims);
            System.out.println("JWT Token generated successfully");

            // Redirect to frontend
            String redirectUrl = "http://localhost:5173/oauth-success?token=" + token + "&user=" + user.getUsername();
            System.out.println("Redirecting to: " + redirectUrl);
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            
        } catch (Exception e) {
            System.err.println("ERROR in OAuth2SuccessHandler: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect("http://localhost:5173/login?error=google_login_failed");
        }
    }
}