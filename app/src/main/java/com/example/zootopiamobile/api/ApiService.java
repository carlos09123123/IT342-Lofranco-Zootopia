package com.example.zootopiamobile.api;

import java.util.Map;
import retrofit2.Call;
import retrofit2.http.*;

public interface ApiService {

    @POST("users/signup")
    Call<String> signup(@Body SignupRequest request);

    @POST("users/login")
    Call<LoginResponse> login(@Body LoginRequest request);

    @GET("users/me")
    Call<Map<String, String>> getCurrentUser(@Header("Authorization") String token);
}