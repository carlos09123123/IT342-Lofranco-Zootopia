import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from './pages/AdminUsers';
import AdminAppointments from './pages/AdminAppointments';
import OAuthSuccess from "./pages/OAuthSuccess"; // ← Add this line

// Protected route component to handle authentication
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Admin route component to handle admin authentication
function AdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userData.role === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// Layout component to handle header and user state
function Layout({ children }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token) {
      setUser(userData);
    } else {
      setUser(null);
    }
    
    // Listen for login/logout events
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (token) {
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginSuccess', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleStorageChange);
    };
  }, []);

  return (
    <>
      <Header user={user} activePage={location.pathname.substring(1) || 'home'} />
      {children}
    </>
  );
}

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup", "/admin", "/oauth-success"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  
  // Auth state listener
  useEffect(() => {
    const handleLogin = () => {
      console.log("Login event detected");
    };
    
    window.addEventListener('loginSuccess', handleLogin);
    return () => {
      window.removeEventListener('loginSuccess', handleLogin);
    };
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} /> {/* Now this will work */}
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* Admin routes */}
      <Route path="/adminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/adminUsers" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/adminAppointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />

      {/* Public routes with layout */}
      <Route 
        path="/" 
        element={
          shouldHideHeader ? (
            <HomePage />
          ) : (
            <Layout>
              <HomePage />
            </Layout>
          )
        } 
      />

      <Route
        path="/services"
        element={
          shouldHideHeader ? (
            <ServicesPage />
          ) : (
            <Layout>
              <ServicesPage />
            </Layout>
          )
        }
      />

      <Route
        path="/about"
        element={
          shouldHideHeader ? (
            <AboutPage />
          ) : (
            <Layout>
              <AboutPage />
            </Layout>
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {shouldHideHeader ? (
              <ProfilePage />
            ) : (
              <Layout>
                <ProfilePage />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;