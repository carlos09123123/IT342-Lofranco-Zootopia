package com.example.zootopiamobile.utils;

import android.content.Context;
import android.content.SharedPreferences;
import com.example.zootopiamobile.ZootopiaApplication;

public class SharedPrefManager {
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_USERNAME = "username";
    private static final String KEY_FIRST_NAME = "first_name";
    private static final String KEY_LAST_NAME = "last_name";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_ROLE = "role";

    private static volatile SharedPrefManager INSTANCE = null;
    private final SharedPreferences prefs;

    private SharedPrefManager(Context context) {
        this.prefs = context.getSharedPreferences("zootopia_prefs", Context.MODE_PRIVATE);
    }

    public static SharedPrefManager getInstance() {
        if (INSTANCE == null) {
            synchronized (SharedPrefManager.class) {
                if (INSTANCE == null) {
                    INSTANCE = new SharedPrefManager(ZootopiaApplication.Companion.getContext());
                }
            }
        }
        return INSTANCE;
    }

    public void saveUserSession(
            String token,
            int userId,
            String username,
            String firstName,
            String lastName,
            String email,
            String role
    ) {
        prefs.edit()
                .putBoolean(KEY_IS_LOGGED_IN, true)
                .putString(KEY_TOKEN, token)
                .putInt(KEY_USER_ID, userId)
                .putString(KEY_USERNAME, username)
                .putString(KEY_FIRST_NAME, firstName)
                .putString(KEY_LAST_NAME, lastName)
                .putString(KEY_EMAIL, email)
                .putString(KEY_ROLE, role)
                .apply();
    }

    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    public String getFullName() {
        String firstName = prefs.getString(KEY_FIRST_NAME, "");
        String lastName = prefs.getString(KEY_LAST_NAME, "");
        if (!firstName.isEmpty() || !lastName.isEmpty()) {
            return (firstName + " " + lastName).trim();
        } else {
            return prefs.getString(KEY_USERNAME, "User");
        }
    }

    public String getUsername() {
        return prefs.getString(KEY_USERNAME, null);
    }

    public String getEmail() {
        return prefs.getString(KEY_EMAIL, null);
    }

    public int getUserId() {
        return prefs.getInt(KEY_USER_ID, -1);
    }

    public String getRole() {
        return prefs.getString(KEY_ROLE, null);
    }

    public void logout() {
        prefs.edit().clear().apply();
    }
}