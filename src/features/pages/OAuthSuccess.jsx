import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        console.log("OAuthSuccess rendered, checking for token");

        // First, try to get the token from the URL
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');

        if (!token) {
          console.log("No token found in URL, redirecting to login");
          navigate('/login', { state: { error: 'Google login failed - no token received' } });
          return;
        }

        console.log("Token received:", token);
        localStorage.setItem('token', token);

        const userData = {
          name: 'User',
          avatar: '/default-avatar.png',
        };

        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));

            userData.name = payload.name || userData.name;
            userData.avatar = payload.picture || userData.avatar;
            if (payload.googleId) userData.googleId = payload.googleId;
            if (payload.email) {
             
              userData.username = payload.email.split('@')[0];
              
            }
            if (payload.userId) userData.userId = payload.userId;
            if (payload.role) userData.role = payload.role;
          }
        } catch (err) {
          console.error("Error decoding token:", err);
        }
        
        localStorage.setItem('googleuser', JSON.stringify(userData));

        // Notify app of login success
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("loginSuccess"));

        // Optional short delay
        setTimeout(() => {
          console.log("Redirecting to homepage");
          navigate('/');
        }, 500);
      } catch (error) {
        console.error("Unexpected error during OAuth processing:", error);
        navigate('/login', { state: { error: 'An unexpected error occurred during login' } });
      }
    };

    processOAuthLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-50 to-red-100/30">
      <div className="text-center">
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