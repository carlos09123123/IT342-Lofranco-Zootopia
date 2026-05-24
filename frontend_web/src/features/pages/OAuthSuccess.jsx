import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import animation from '@shared/assets/animation.gif';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        console.log("OAuthSuccess rendered, checking for token");

        // Get token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const username = params.get('user');

        console.log("Token received:", token ? `${token.substring(0, 50)}...` : "No token");
        console.log("Username from URL:", username);

        if (!token) {
          console.log("No token found in URL, redirecting to login");
          navigate('/login', { state: { error: 'Google login failed - no token received' } });
          return;
        }

        // Store the token
        localStorage.setItem('token', token);
        localStorage.setItem('adminToken', token); // Also store as adminToken for compatibility

        // Prepare user data
        let userData = {
          username: username || 'User',
          role: 'customer',
          authProvider: 'google'
        };

        // Try to decode token payload for more user info
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Decoded token payload:", payload);
            
            userData = {
              username: payload.sub || username || payload.email?.split('@')[0] || 'User',
              email: payload.email,
              userId: payload.userId,
              role: payload.role?.toLowerCase() || 'customer',
              name: payload.name,
              authProvider: payload.authProvider || 'google',
              googleId: payload.googleId
            };
          }
        } catch (err) {
          console.error("Error decoding token:", err);
        }

        // If username from URL param exists, use it
        if (username) {
          userData.username = username;
        }

        console.log("Storing user data:", userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Also store google user for compatibility
        localStorage.setItem('googleuser', JSON.stringify(userData));

        // Notify app of login success
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("loginSuccess"));

        console.log("Login successful, redirecting to homepage");

        // Short delay before redirecting
        setTimeout(() => {
          navigate('/');
        }, 1500);
        
      } catch (error) {
        console.error("Unexpected error during OAuth processing:", error);
        navigate('/login', { state: { error: 'An unexpected error occurred during login' } });
      }
    };

    processOAuthLogin();
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-50 to-red-100/30">
      <div className="text-center max-w-md mx-auto px-4">
        <img 
          src={animation} 
          alt="Loading..." 
          className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8"
        />
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-2">Welcome to Zootopia!</h2>
        <p className="text-gray-600 text-lg">Processing your Google login...</p>
        <p className="text-gray-500 mt-2">Please wait while we redirect you to your pet paradise.</p>
      </div>
    </div>
  );
}