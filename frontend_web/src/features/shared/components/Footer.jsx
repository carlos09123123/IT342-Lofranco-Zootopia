import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-8 w-8 text-red-500" />
              <span className="font-bold text-2xl text-white">Zootopia</span>
            </div>
            <p className="text-gray-400">Your one-stop shop for all pet needs.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-red-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Pet Street, Cebu City, PH</p>
              <p>+63 999 999 9999</p>
              <p>info@zootopia.com</p>
            </address>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Business Hours</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Monday - Friday: 9am - 7pm</li>
              <li>Saturday: 9am - 5pm</li>
              <li>Sunday: 10am - 4pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Zootopia. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}