package com.example.zootopiamobile.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.zootopiamobile.databinding.ActivityDashboardBinding;
import com.example.zootopiamobile.utils.SharedPrefManager;

public class DashboardActivity extends AppCompatActivity {

    private ActivityDashboardBinding binding;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sharedPrefManager = SharedPrefManager.getInstance();

        displayUserInfo();
        setupClickListeners();
    }

    private void displayUserInfo() {
        String fullName = sharedPrefManager.getFullName();
        String username = sharedPrefManager.getUsername() != null ? sharedPrefManager.getUsername() : "";
        String email = sharedPrefManager.getEmail() != null ? sharedPrefManager.getEmail() : "";
        String role = sharedPrefManager.getRole() != null ? sharedPrefManager.getRole() : "Customer";

        if (!fullName.isEmpty()) {
            binding.tvWelcomeMessage.setText("Welcome to Zootopia, " + fullName + "!");
        } else {
            binding.tvWelcomeMessage.setText("Welcome to Zootopia, " + username + "!");
        }

        binding.tvUsername.setText("@" + username);
        binding.tvUserEmail.setText(email);
        binding.tvUserRole.setText(role);
    }

    private void setupClickListeners() {
        binding.btnLogout.setOnClickListener(v -> {
            sharedPrefManager.logout();
            Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show();

            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
}
