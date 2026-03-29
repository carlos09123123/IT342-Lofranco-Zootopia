package com.example.zootopiamobile.api;

public class LoginResponse {
    private String token;
    private Integer userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String error;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
