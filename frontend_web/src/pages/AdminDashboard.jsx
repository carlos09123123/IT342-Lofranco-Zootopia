import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import axios from 'axios';

const API_BASE_URL_ORDER = import.meta.env.VITE_API_BASE_URL_ORDER;

const AdminDashboard = () => {
  const [username, setUsername] = useState('Admin');
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    inventory: 0,
    appointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No admin token found');
          return;
        }

        // Fetch orders
        const ordersResponse = await axios.get(`${API_BASE_URL_ORDER}/getAllOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Simulate other stats (replace with actual API calls if available)
        setStats({
          users: 1243,
          orders: ordersResponse.data.length,
          inventory: 89,
          appointments: 42,
        });

        // Optionally set username from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.username) {
          setUsername(userData.username);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Admin logged out');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Zootopia Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Inventory Items" 
            value={stats.inventory} 
            icon="📊" 
            color="bg-red-100 text-red-800 border-l-4 border-red-600"
          />
          <DashboardCard 
            title="Total Users" 
            value={stats.users} 
            icon="👥" 
            color="bg-red-50 text-red-700 border-l-4 border-red-500"
          />
          <DashboardCard 
            title="Recent Orders" 
            value={stats.orders} 
            icon="📦" 
            color="bg-red-100 text-red-800 border-l-4 border-red-600"
          />
          <DashboardCard 
            title="Appointments" 
            value={stats.appointments} 
            icon="📅" 
            color="bg-red-50 text-red-700 border-l-4 border-red-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-800">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton 
              label="Add Product" 
              path="/adminProducts"
              icon="➕"
            />
            <ActionButton 
              label="View Users" 
              path="/adminUsers" 
              icon="👥"
            />
            <ActionButton 
              label="Process Orders" 
              path="/adminOrders"
              icon="📦"
            />
            <ActionButton 
              label="Schedule" 
              path="/adminAppointments" 
              icon="📅"
            />
          </div>
        </div>

        {/* Recent Activity Section - Added for better dashboard experience */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Recent Orders
            </h3>
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">Loading recent orders...</p>
              {/* Add recent orders list here when API is available */}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Upcoming Appointments
            </h3>
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">Loading appointments...</p>
              {/* Add appointments list here when API is available */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Dashboard Card Component with red theme
const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

// Reusable Action Button Component with red hover effect
const ActionButton = ({ label, path, icon }) => (
  <Link 
    to={path}
    className="border-2 border-red-200 rounded-lg p-4 text-center hover:bg-red-50 hover:border-red-400 transition-all duration-200 group"
  >
    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">{label}</span>
  </Link>
);

export default AdminDashboard;