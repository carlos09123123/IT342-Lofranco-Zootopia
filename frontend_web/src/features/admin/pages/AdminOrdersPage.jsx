import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Package, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const API_BASE_URL = 'http://localhost:8080/api/order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login as admin");
      return null;
    }
    return token;
  };

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/getAllOrders`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!orderId) {
      toast.error("Order ID is missing");
      return;
    }

    setUpdating(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setUpdating(false);
        return;
      }

      console.log("Updating order:", orderId, "to status:", status);
      
      const response = await axios.put(
        `${API_BASE_URL}/updateStatus/${orderId}?status=${status}`,
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        toast.success(`Order #${orderId} status updated to ${status}`);
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ORDER ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">CUSTOMER</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">DATE</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">TOTAL</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">PAYMENT METHOD</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ORDER STATUS</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">PAYMENT STATUS</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      {order.user?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.orderDate}
                    </td>
                    <td className="px-6 py-4 font-medium text-red-600">
                      ₱{order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          disabled={updating}
                          className="text-sm border rounded-lg px-3 py-1 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Order #{selectedOrder.orderId}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">{item.orderItemName}</p>
                        <p className="text-sm text-gray-500">
                          ₱{item.price} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Delivery Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.deliveryAddress.streetBuildingHouseNo}</p>
                    <p>{selectedOrder.deliveryAddress.barangay}</p>
                    <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.province}</p>
                    <p>{selectedOrder.deliveryAddress.region}</p>
                    {selectedOrder.deliveryAddress.postalCode && (
                      <p>Postal Code: {selectedOrder.deliveryAddress.postalCode}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Remarks */}
              {selectedOrder.remarks && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Remarks</h3>
                  <p className="text-gray-600">{selectedOrder.remarks}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₱{selectedOrder.totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}