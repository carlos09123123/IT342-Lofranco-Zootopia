import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from '@shared/components/Footer';
import { Button } from '@shared/components/Button';
import { Minus, Plus, Star, ShoppingCart, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/product';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  console.log("Product ID from URL:", id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error('Product ID is missing');
        }
        
        console.log("Fetching product with ID:", id);
        const response = await fetch(`${API_BASE_URL}/getProduct/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Product received:", data);
        setProduct(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to add items to cart");
        navigate('/login');
        return;
      }
      
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      const existingIndex = existingCart.findIndex(item => item.productId === product.productId);
      
      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push({
          productId: product.productId,
          productName: product.productName,
          price: product.productPrice,
          quantity: quantity,
          image: product.productImage,
          productType: product.productType
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert(`Added ${quantity} x ${product.productName} to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-red-600 hover:bg-red-700"
            >
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h2>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-red-600 hover:bg-red-700"
            >
              Back to Products
            </Button>
          </div>
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
              Back to Products
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.productName}</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                {product.productImage ? (
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-gray-500">{product.productType || 'General'}</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    ₱{product.productPrice}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-red-600 hover:text-red-600 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-red-600 hover:text-red-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full py-6 rounded-full bg-red-600 hover:bg-red-700 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong className="text-gray-800">Stock Status:</strong> {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</li>
                    <li><strong className="text-gray-800">SKU:</strong> ZOO-{product.productId}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}