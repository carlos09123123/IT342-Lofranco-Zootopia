package com.example.zootopiamobile.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.zootopiamobile.api.ApiClient;
import com.example.zootopiamobile.api.LoginRequest;
import com.example.zootopiamobile.api.LoginResponse;
import com.example.zootopiamobile.databinding.ActivityLoginBinding;
import com.example.zootopiamobile.utils.SharedPrefManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sharedPrefManager = SharedPrefManager.getInstance();

        if (sharedPrefManager.isLoggedIn()) {
            navigateToDashboard();
        }

        setupClickListeners();
    }

    private void setupClickListeners() {
        binding.btnLogin.setOnClickListener(v -> performLogin());
        binding.tvRegisterLink.setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });
    }

    private void performLogin() {
        String username = binding.etUsername.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (username.isEmpty()) {
            binding.etUsername.setError("Username is required");
            return;
        }
        if (password.isEmpty()) {
            binding.etPassword.setError("Password is required");
            return;
        }

        binding.btnLogin.setEnabled(false);
        binding.btnLogin.setText("Logging in...");

        LoginRequest request = new LoginRequest(username, password);
        ApiClient.getApiService().login(request).enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                binding.btnLogin.setEnabled(true);
                binding.btnLogin.setText("Login");

                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse userData = response.body();

                    if (userData.getError() != null) {
                        Toast.makeText(LoginActivity.this, userData.getError(), Toast.LENGTH_SHORT).show();
                    } else if (userData.getToken() != null) {
                        sharedPrefManager.saveUserSession(
                                userData.getToken(),
                                userData.getUserId() != null ? userData.getUserId() : -1,
                                userData.getUsername() != null ? userData.getUsername() : username,
                                userData.getFirstName() != null ? userData.getFirstName() : "",
                                userData.getLastName() != null ? userData.getLastName() : "",
                                userData.getEmail() != null ? userData.getEmail() : "",
                                userData.getRole() != null ? userData.getRole() : "CUSTOMER"
                        );

                        Toast.makeText(
                                LoginActivity.this,
                                "Welcome " + userData.getFirstName() + " " + userData.getLastName() + "!",
                                Toast.LENGTH_LONG
                        ).show();

                        navigateToDashboard();
                    }
                } else {
                    Toast.makeText(LoginActivity.this, "Invalid username or password", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                binding.btnLogin.setEnabled(true);
                binding.btnLogin.setText("Login");
                Toast.makeText(LoginActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void navigateToDashboard() {
        Intent intent = new Intent(this, DashboardActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}