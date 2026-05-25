import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@shared/components/Button';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL_ORDER = 'http://localhost:8080/api/order';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const updateOrderStatus = async () => {
      let orderId = searchParams.get('order_id');
      
      if (!orderId) {
        const pendingOrder = sessionStorage.getItem('pendingOrderId');
        if (pendingOrder) {
          orderId = pendingOrder;
          sessionStorage.removeItem('pendingOrderId');
        }
      }
      
      if (orderId) {
        setUpdating(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.put(
            `${API_BASE_URL_ORDER}/markPaymentComplete/${orderId}`,
            {},
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          if (response.data.success) {
            setUpdateSuccess(true);
            toast.success("Payment confirmed! Your order is now complete.");
          }
        } catch (error) {
          console.error("Error updating order:", error);
          toast.error("Payment confirmed but order status update failed. Please contact support.");
        } finally {
          setUpdating(false);
        }
      } else {
        toast.info("Payment successful! Check your orders for status.");
      }
    };
    
    updateOrderStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be processed soon.
        </p>
        {updating && (
          <div className="mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Updating order status...</p>
          </div>
        )}
        {updateSuccess && (
          <p className="text-green-600 text-sm mb-4">✓ Order status updated successfully!</p>
        )}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/Mypurchases')}
            className="w-full bg-red-600 hover:bg-red-700 rounded-full"
          >
            View My Orders
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/products')}
            className="w-full rounded-full hover:border-red-600 hover:text-red-600"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}