import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '@shared/components/Footer';
import { Button } from '@shared/components/Button';
import { ArrowLeft, Package, CreditCard, Smartphone, Calendar, DollarSign } from 'lucide-react';

const API_BASE_URL_ORDER = 'http://localhost:8080/api/order';

export default function OrderDetails() {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [OrderID]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view order details");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log("Fetching order details for ID:", OrderID);
      
      const response = await axios.get(`${API_BASE_URL_ORDER}/getOrderDetails/${OrderID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Order details:", response.data);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again.");
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
      return <Smartphone className="w-5 h-5" />;
    }
    return <CreditCard className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
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
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Order</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button 
                onClick={() => navigate('/Mypurchases')}
                className="bg-red-600 hover:bg-red-700 rounded-full"
              >
                Back to Orders
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Order Not Found</h2>
              <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
              <Button 
                onClick={() => navigate('/Mypurchases')}
                className="bg-red-600 hover:bg-red-700 rounded-full"
              >
                Back to Orders
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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/Mypurchases')}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100/30">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
                    <p className="text-gray-500 mt-1">{order.orderDate}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="p-6 border-b">
                <h2 className="font-semibold text-lg mb-4">Order Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{order.orderDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPaymentIcon(order.paymentMethod)}
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="font-medium">{order.paymentStatus}</p>
                    </div>
                  </div>
                </div>
                {order.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-700">{order.description}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="p-6 border-b">
                <h2 className="font-semibold text-lg mb-4">Items Ordered</h2>
                <div className="space-y-4">
                  {order.orderItems && order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.orderItemImage ? (
                          <img 
                            src={item.orderItemImage} 
                            alt={item.orderItemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.orderItemName}</h3>
                        <p className="text-sm text-gray-500">
                          ?{item.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ?{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-red-600">?{order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/products')}
                    className="bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    Shop Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}