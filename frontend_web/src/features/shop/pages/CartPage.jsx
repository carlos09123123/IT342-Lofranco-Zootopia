import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@shared/components/Footer';
import { Button } from '@shared/components/Button';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    setLoading(false);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.setItem("cart", "[]");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    const checkoutItems = cartItems.map(item => ({
      product: {
        productID: item.productId,
        productName: item.productName,
        productPrice: item.price,
        productImage: item.image
      },
      quantity: item.quantity
    }));
    
    const subtotal = getTotalPrice();
    const shippingFee = 50;
    const total = subtotal + shippingFee;
    
    navigate('/checkout', {
      state: {
        selectedItems: checkoutItems,
        orderSummary: {
          subtotal: subtotal,
          shippingFee: shippingFee,
          total: total
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading cart...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-r from-red-50 to-red-100/30 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Shopping Cart</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
                <Link to="/products">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="p-4 flex gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.productName} className="object-cover w-full h-full rounded-lg" />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.productName}</h3>
                            <p className="text-red-600 font-bold">₱{item.price}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-2 border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>₱{getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₱50.00</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-red-600">₱{(getTotalPrice() + 50).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleProceedToCheckout}
                      className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-full"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full text-center text-sm text-gray-500 hover:text-red-600 mt-3"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}