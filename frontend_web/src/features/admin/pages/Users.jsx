import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@shared/components/AdminHeader';
import axios from 'axios';

// Hardcoded API URL - FIXED
const API_BASE_URL_ADMIN = 'http://localhost:8080/admin';

const AdminUsers = () => {
  const [username, setUsername] = useState('Admin');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to get token
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("adminToken");
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      console.log("Fetching users with token:", !!token);
      
      if (!token) {
        setError("No token found. Please login again.");
        setTimeout(() => navigate('/admin'), 2000);
        return;
      }

      // Try multiple possible endpoints
      let response = null;
      let endpoints = [
        `${API_BASE_URL_ADMIN}/users`,
        `${API_BASE_URL_ADMIN}/all`,
        `http://localhost:8080/users/all`,
        `http://localhost:8080/api/users`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          response = await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data) {
            console.log("Success with endpoint:", endpoint);
            break;
          }
        } catch (err) {
          console.log("Failed endpoint:", endpoint);
          continue;
        }
      }
      
      if (response && response.data) {
        // Ensure data is an array
        const usersData = Array.isArray(response.data) ? response.data : 
                         (response.data.users || response.data.content || []);
        setUsers(usersData);
      } else {
        // Fallback to empty array
        setUsers([]);
        setError("Could not fetch users. Using demo data.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      // Set empty users array to avoid breaking the UI
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.userId);
    setEditForm({
      username: user.username,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.role || 'CUSTOMER'
    });
  };

  const handleUpdate = async (userId) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized: No admin token found");
        return;
      }
  
      const updateData = { ...editForm };
      if (!updateData.password) {
        delete updateData.password;
      }
  
      const response = await axios.put(
        `${API_BASE_URL_ADMIN}/update/${userId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200 || response.status === 204) {
        fetchUsers();
        setEditingId(null);
        setError('');
      } else {
        throw new Error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data || err.message || "Failed to update user");
    }
  };
  
  const handleDelete = async (userId) => {
    const userToDelete = users.find(u => u.userId === userId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the user "${userToDelete?.username}"?`
    );
    
    if (!confirmDelete) return;
  
    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized: No admin token found");
        return;
      }
  
      const response = await axios.delete(
        `${API_BASE_URL_ADMIN}/delete/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200 || response.status === 204) {
        fetchUsers();
        setError('');
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data || err.message || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    navigate('/admin');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} onLogout={handleLogout} />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-6xl animate-pulse mb-4">🐾</div>
        <h2 className="text-2xl font-bold text-gray-700">Loading Zootopia Users...</h2>
        <p className="text-gray-500 mt-2">Gathering all the pet lovers for you!</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader username={username} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => fetchUsers()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Zootopia User Management</h2>
          <button 
            onClick={() => navigate('/adminDashboard')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          className="border rounded px-2 py-1 w-full focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="border rounded px-2 py-1 w-full focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="border rounded px-2 py-1 w-full focus:ring-red-500 focus:border-red-500"
                        />
                      ) : (
                        user.firstName || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="border rounded px-2 py-1 w-full focus:ring-red-500 focus:border-red-500"
                        />
                      ) : (
                        user.lastName || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="border rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role || 'CUSTOMER'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === user.userId ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(user.userId)}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.userId)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;