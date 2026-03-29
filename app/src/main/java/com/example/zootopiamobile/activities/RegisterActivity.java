package com.example.zootopiamobile.activities;

import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.zootopiamobile.api.ApiClient;
import com.example.zootopiamobile.api.SignupRequest;
import com.example.zootopiamobile.databinding.ActivityRegisterBinding;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private ActivityRegisterBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupClickListeners();
    }

    private void setupClickListeners() {
        binding.btnRegister.setOnClickListener(v -> performRegistration());
        binding.tvLoginLink.setOnClickListener(v -> finish());
    }

    private void performRegistration() {
        String username = binding.etUsername.getText().toString().trim();
        String firstName = binding.etFirstName.getText().toString().trim();
        String lastName = binding.etLastName.getText().toString().trim();
        String email = binding.etEmail.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();
        String confirmPassword = binding.etConfirmPassword.getText().toString().trim();

        if (username.isEmpty()) {
            binding.etUsername.setError("Username is required");
            return;
        }
        if (username.length() < 3) {
            binding.etUsername.setError("Username must be at least 3 characters");
            return;
        }
        if (firstName.isEmpty()) {
            binding.etFirstName.setError("First name is required");
            return;
        }
        if (lastName.isEmpty()) {
            binding.etLastName.setError("Last name is required");
            return;
        }
        if (email.isEmpty()) {
            binding.etEmail.setError("Email is required");
            return;
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.etEmail.setError("Invalid email format");
            return;
        }
        if (password.isEmpty()) {
            binding.etPassword.setError("Password is required");
            return;
        }
        if (password.length() < 6) {
            binding.etPassword.setError("Password must be at least 6 characters");
            return;
        }
        if (!password.equals(confirmPassword)) {
            binding.etConfirmPassword.setError("Passwords do not match");
            return;
        }

        binding.btnRegister.setEnabled(false);
        binding.btnRegister.setText("Registering...");

        SignupRequest request = new SignupRequest(username, firstName, lastName, email, password);
        ApiClient.getApiService().signup(request).enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                binding.btnRegister.setEnabled(true);
                binding.btnRegister.setText("Register");

                if (response.isSuccessful()) {
                    Toast.makeText(
                            RegisterActivity.this,
                            "Registration Successful! Please login.",
                            Toast.LENGTH_LONG
                    ).show();
                    finish();
                } else {
                    try {
                        String errorMsg = response.errorBody() != null ? response.errorBody().string() : "Registration failed";
                        Toast.makeText(RegisterActivity.this, errorMsg, Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        Toast.makeText(RegisterActivity.this, "Registration failed", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                binding.btnRegister.setEnabled(true);
                binding.btnRegister.setText("Register");
                Toast.makeText(RegisterActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}