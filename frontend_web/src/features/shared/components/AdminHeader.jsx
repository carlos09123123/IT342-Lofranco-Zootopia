import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-gray-300">Products</Link>
          <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
          <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
          <Link to="/admin/appointments" className="hover:text-gray-300">Appointments</Link>
          <Link to="/" className="hover:text-gray-300">View Site</Link>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
