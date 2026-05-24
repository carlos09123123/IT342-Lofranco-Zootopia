import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '@shared/components/Footer';
import { Button } from '@shared/components/Button';
import { Package, ChevronRight, ShoppingBag, CreditCard, Smartphone } from 'lucide-react';

const API_BASE_URL_ORDER = 'http://localhost:8080/api/order';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("googleuser"));
      const userId = storedUser?.id || storedUser?.userId;

      if (!token || !userId) {
        setError("Please login to view your orders");
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL_ORDER}/getAllOrdersByUserId`, {
        params: { userId: userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'PAID':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method) => {
    if (method?.toLowerCase().includes('gcash')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Orders</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-red-600 hover:bg-red-700 rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <section className="bg-gradient-to-r from-red-50 to-red-100/30 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Button 
                  onClick={() => navigate('/products')}
                  className="bg-red-600 hover:bg-red-700 rounded-full"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.orderId} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                    <div className="p-6 border-b bg-gray-50">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                          <p className="text-sm text-gray-500">{order.orderDate}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getPaymentIcon(order.paymentMethod)}
                            <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.orderItems && order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              {item.orderItemImage ? (
                                <img 
                                  src={item.orderItemImage} 
                                  alt={item.orderItemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{item.orderItemName}</h3>
                              <p className="text-sm text-gray-500">
                                ₱{item.price} x {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ₱{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t mt-6 pt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-red-600">₱{order.totalPrice?.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/Mypurchases/${order.orderId}`)}
                          className="rounded-full hover:border-red-600 hover:text-red-600"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}