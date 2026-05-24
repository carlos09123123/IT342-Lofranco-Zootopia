import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("googleuser"));
      const userId = storedUser?.id || storedUser?.userId;

      console.log("Token:", token);
      console.log("User ID:", userId);

      if (!token || !userId) {
        setError("Please login to view your orders");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/order/getAllOrdersByUserId`, {
        params: { userId: userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Orders received:", response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #dc2626',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading your orders...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/products')}
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <button 
          onClick={() => navigate('/products')}
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>My Orders</h1>
      {orders.map(order => (
        <div key={order.orderId} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          background: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <strong>Order #{order.orderId}</strong>
            <span style={{ 
              background: order.orderStatus === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
              color: order.orderStatus === 'COMPLETED' ? '#166534' : '#92400e',
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '12px'
            }}>
              {order.orderStatus}
            </span>
          </div>
          <p>Date: {order.orderDate}</p>
          <p>Payment: {order.paymentMethod}</p>
          <p>Total: ₱{order.totalPrice?.toFixed(2)}</p>
          <button 
            onClick={() => navigate(`/Mypurchases/${order.orderId}`)}
            style={{
              marginTop: '10px',
              background: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}