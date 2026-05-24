import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/address';

export default function AddressForm({ onAddressSubmit, initialAddress }) {
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
    
    // Validate required fields
    if (!address.region || !address.province || !address.city || !address.barangay) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/addAddress`,
        address,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onAddressSubmit(response.data);
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition disabled:opacity-50"
      >
        {loading ? 'Saving Address...' : 'Confirm Address'}
      </button>
    </form>
  );
}