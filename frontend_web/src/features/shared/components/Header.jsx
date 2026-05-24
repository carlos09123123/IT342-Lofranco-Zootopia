import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, PawPrint, LogOut, Settings, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('googleuser');
    toast.success('Logged out successfully');
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-gray-800">Zootopia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition ${
                  isActive(link.path)
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-red-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="hidden md:block text-sm text-gray-700">
                    {user.firstName || user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircle className="w-4 h-4" />
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <Link
                        to="/Mypurchases"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 transition ${
                  isActive(link.path)
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-4 mt-4 border-t">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-600 hover:text-red-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-600 hover:text-red-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}