import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ShoppingBag, CreditCard, Smartphone, MapPin } from "lucide-react";
import Footer from "@shared/components/Footer";
import { Button } from "@shared/components/Button";
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/users';
const API_BASE_URL_ORDER = 'http://localhost:8080/api/order';
const API_BASE_URL_PAYMENT = 'http://localhost:8080/api/payment';
const API_BASE_URL_ADDRESS = 'http://localhost:8080/api/address';

// Address Form Component
function AddressForm({ onAddressSubmit, initialAddress, onCancel }) {
  const [address, setAddress] = useState({
    region: '',
    province: '',
    city: '',
    barangay: '',
    postalCode: '',
    streetBuildingHouseNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialAddress) {
      setAddress({
        region: initialAddress.region || '',
        province: initialAddress.province || '',
        city: initialAddress.city || '',
        barangay: initialAddress.barangay || '',
        postalCode: initialAddress.postalCode || '',
        streetBuildingHouseNo: initialAddress.streetBuildingHouseNo || ''
      });
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.region || !address.province || !address.city || !address.barangay) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL_ADDRESS}/addAddress`,
        address,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onAddressSubmit(response.data);
      toast.success("Address saved successfully!");
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Region/State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="region"
          value={address.region}
          onChange={handleChange}
          placeholder="e.g., Metro Manila, CALABARZON"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Province <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="province"
          value={address.province}
          onChange={handleChange}
          placeholder="e.g., Metro Manila, Cavite, Laguna"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City/Municipality <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="e.g., Manila, Quezon City, Makati"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Barangay <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="barangay"
          value={address.barangay}
          onChange={handleChange}
          placeholder="e.g., Barangay 123, Poblacion"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          placeholder="e.g., 1000, 4100"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street/Building/House No.
        </label>
        <input
          type="text"
          name="streetBuildingHouseNo"
          value={address.streetBuildingHouseNo}
          onChange={handleChange}
          placeholder="e.g., 123 Main St, Building A"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Address'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-full transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedItems: passedItems } = location.state || {};

  // Fetch user's existing address
  const fetchUserAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL_ADDRESS}/getAddress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.addressId) {
        setSavedAddress(response.data);
        setAddressSaved(true);
        console.log("Existing address loaded:", response.data);
      }
    } catch (error) {
      console.log("No existing address found");
    }
  };

  useEffect(() => {
    const loadCartAndUser = async () => {
      setLoading(true);
      
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      if (savedCart.length === 0 && (!passedItems || passedItems.length === 0)) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }
      
      let items = passedItems;
      
      if (!items || items.length === 0) {
        items = savedCart.map(item => ({
          product: {
            productId: item.productId,
            productName: item.productName,
            productPrice: item.price,
            productImage: item.image
          },
          quantity: item.quantity
        }));
      }
      
      setCartItems(items);
      
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("googleuser"));
        const userId = storedUser?.id || storedUser?.userId;

        if (!userId || !token) {
          toast.error("Please log in to proceed.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data);
        
        // Fetch user's address
        await fetchUserAddress();
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCartAndUser();
  }, [navigate, passedItems]);

  const getTotalAmount = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.productPrice * item.quantity), 0);
    const shippingFee = 50;
    return { subtotal, shippingFee, total: subtotal + shippingFee };
  };

  const { subtotal, shippingFee, total } = getTotalAmount();

  const createPayMongoPaymentLink = async (orderId, amount, description) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_BASE_URL_PAYMENT}/create-payment-link`,
        {
          orderId: orderId.toString(),
          amount: amount,
          description: description,
          successUrl: `${window.location.origin}/payment-success`,
          failedUrl: `${window.location.origin}/checkout`
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error creating PayMongo link:", error.response?.data || error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("googleuser"));
    const userId = storedUser?.id || storedUser?.userId;
    const username = storedUser?.username || storedUser?.name;

    if (!token || !userId || !username) {
      toast.error("Please log in to proceed.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("No items to order.");
      navigate("/cart");
      return;
    }

    // For COD, require address first
    if (paymentMethod === "cash" && !addressSaved) {
      setShowAddressForm(true);
      toast.info("Please provide your delivery address");
      return;
    }

    setProcessingPayment(true);

    const orderItems = cartItems.map((item) => ({
      orderItemName: item.product.productName,
      orderItemImage: item.product.productImage || "/placeholder.svg",
      price: item.product.productPrice,
      quantity: item.quantity,
      productId: item.product.productId
    }));

    const orderDate = new Date().toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });

    const orderData = {
      orderItems: orderItems,
      orderDate: orderDate,
      orderStatus: "PENDING",
      paymentMethod: paymentMethod === "cash" ? "Cash on Delivery" : "GCash",
      paymentStatus: "PENDING",
      totalPrice: total,
      description: `Order from ${username} - ${orderItems.length} item(s)`,
      remarks: paymentMethod === "cash" && savedAddress ? `Delivery to: ${savedAddress.streetBuildingHouseNo}, ${savedAddress.barangay}, ${savedAddress.city}, ${savedAddress.province}, ${savedAddress.region}` : "",
      user: { userId: userId }
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL_ORDER}/postOrderRecord`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = response.data.orderId || response.data.orderID || response.data.id;
      
      if (!orderId) {
        throw new Error("Failed to get order ID from response");
      }

      sessionStorage.setItem('pendingOrderId', orderId);
      localStorage.setItem("cart", "[]");
      
      if (paymentMethod === "gcash") {
        toast.loading("Creating payment link...");
        
        const paymentData = await createPayMongoPaymentLink(
          orderId,
          total,
          `Order #${orderId} - Zootopia Purchase`
        );
        
        toast.dismiss();
        
        if (paymentData.checkoutUrl) {
          window.open(paymentData.checkoutUrl, "_blank");
          toast.success("Payment link opened! Complete payment to confirm order.");
          setTimeout(() => {
            navigate('/Mypurchases');
          }, 2000);
        } else {
          throw new Error("Failed to create payment link");
        }
      } else {
        toast.success("Order placed successfully! Pay upon delivery.");
        navigate('/Mypurchases');
      }
      
    } catch (error) {
      console.error("Order processing error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Unknown error";
      toast.error("Order processing failed: " + errorMessage);
      setProcessingPayment(false);
    }
  };

  const handleAddressSubmit = async (address) => {
    setSavedAddress(address);
    setAddressSaved(true);
    setShowAddressForm(false);
    
    // Automatically place order after address is saved
    setTimeout(() => {
      handlePlaceOrder();
    }, 500);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "cash" && !addressSaved) {
      setShowAddressForm(true);
    } else if (method === "cash" && addressSaved) {
      setShowAddressForm(false);
    } else {
      setShowAddressForm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-gray-600">Please login to continue...</p>
            <Button onClick={() => navigate('/login')} className="mt-4 bg-red-600 hover:bg-red-700">
              Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add items to your cart before checking out</p>
            <Button onClick={() => navigate('/products')} className="bg-red-600 hover:bg-red-700">
              Browse Products
            </Button>
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
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2 text-center">
                Complete your purchase by reviewing your order and confirming your details.
              </p>
            </div>
            
            <div className="mb-6">
              <Button variant="ghost" className="flex items-center gap-2 hover:text-red-600" onClick={() => navigate('/cart')}>
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Cart</span>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-7 gap-8">
              <div className="md:col-span-4">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.product.productImage || "/placeholder.svg"}
                            alt={item.product.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product.productName}</h3>
                          <p className="text-sm text-gray-500">
                            ₱{item.product.productPrice} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₱{(item.product.productPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-6 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-medium">₱{shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-red-600">₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {/* Cash on Delivery Option */}
                    <div 
                      onClick={() => handlePaymentMethodChange("cash")}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        paymentMethod === "cash" 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className={`w-6 h-6 ${paymentMethod === "cash" ? "text-red-600" : "text-gray-400"}`} />
                        <div>
                          <p className="font-semibold">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>

                    {/* GCash / PayMongo Option */}
                    <div 
                      onClick={() => handlePaymentMethodChange("gcash")}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        paymentMethod === "gcash" 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className={`w-6 h-6 ${paymentMethod === "gcash" ? "text-red-600" : "text-gray-400"}`} />
                        <div>
                          <p className="font-semibold">GCash (via PayMongo)</p>
                          <p className="text-sm text-gray-500">Pay securely using GCash</p>
                        </div>
                      </div>
                    </div>

                    {/* Address Form for COD */}
                    {showAddressForm && paymentMethod === "cash" && !addressSaved && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                        </div>
                        <AddressForm 
                          onAddressSubmit={handleAddressSubmit}
                          initialAddress={savedAddress}
                          onCancel={() => {
                            setShowAddressForm(false);
                            setPaymentMethod("gcash");
                          }}
                        />
                      </div>
                    )}

                    {/* Display Saved Address */}
                    {addressSaved && paymentMethod === "cash" && savedAddress && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Delivery Address:</p>
                              <p className="text-sm text-gray-600">
                                {savedAddress.streetBuildingHouseNo && `${savedAddress.streetBuildingHouseNo}, `}
                                {savedAddress.barangay},<br />
                                {savedAddress.city}, {savedAddress.province}<br />
                                {savedAddress.region}
                                {savedAddress.postalCode && `, ${savedAddress.postalCode}`}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setAddressSaved(false);
                              setShowAddressForm(true);
                            }}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4 mt-2">
                      <h3 className="font-semibold text-gray-900 mb-2">Billing Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Name:</span> {user.firstName} {user.lastName}</p>
                        <p><span className="text-gray-500">Email:</span> {user.email}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={processingPayment || (paymentMethod === "cash" && !addressSaved && !showAddressForm)}
                      className="w-full rounded-full bg-red-600 hover:bg-red-700 py-3 text-lg"
                    >
                      {processingPayment ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        `Place Order (₱${total.toFixed(2)})`
                      )}
                    </Button>

                    {paymentMethod === "cash" && !addressSaved && !showAddressForm && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Please provide your delivery address to continue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;