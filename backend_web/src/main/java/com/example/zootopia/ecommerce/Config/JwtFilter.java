package com.example.zootopia.ecommerce.Config;

import com.example.zootopia.ecommerce.Service.CustomerUserDetailsService;
import com.example.zootopia.ecommerce.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        System.out.println("JwtFilter - Request URI: " + requestURI);
        
        String authHeader = request.getHeader("Authorization");
        System.out.println("JwtFilter - Auth Header present: " + (authHeader != null));
        
        String token = null;
        String username = null;

        // Skip token validation for public endpoints
        if (requestURI.equals("/users/signup") || 
            requestURI.equals("/users/login") || 
            requestURI.equals("/admin/login") ||
            requestURI.equals("/api/product/getProduct") ||
            requestURI.startsWith("/api/product/getProduct/")) {
            System.out.println("JwtFilter - Skipping token validation for public endpoint: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            System.out.println("JwtFilter - Token extracted: " + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));
            username = jwtService.extractUserName(token);
            System.out.println("JwtFilter - Username extracted: " + username);

            // Extract role from token
            String role = jwtService.extractRole(token);
            System.out.println("JwtFilter - Role extracted: " + role);

            // Set auth type based on role in token, not just URL path
            if (role != null && role.equals("ROLE_ADMIN")) {
                customerUserDetailsService.setAuthType("ADMIN");
                System.out.println("JwtFilter - Auth type set to: ADMIN");
            } else {
                customerUserDetailsService.setAuthType("CUSTOMER");
                System.out.println("JwtFilter - Auth type set to: CUSTOMER");
            }
        } else {
            System.out.println("JwtFilter - No valid Authorization header found");
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);
            System.out.println("JwtFilter - UserDetails loaded: " + (userDetails != null));
            System.out.println("JwtFilter - User authorities: " + userDetails.getAuthorities());
            
            if(jwtService.validateToken(token, userDetails)){
                System.out.println("JwtFilter - Token validated successfully");
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                System.out.println("JwtFilter - Authentication set in SecurityContext");
            } else {
                System.out.println("JwtFilter - Token validation FAILED");
            }
        }

        filterChain.doFilter(request, response);
    }
}