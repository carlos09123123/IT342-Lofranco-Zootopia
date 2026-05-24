import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@shared/components/AdminHeader';
import axios from 'axios';

// Hardcoded API URL
const API_BASE_URL_APPOINTMENTS = 'http://localhost:8080/appointments';

const AdminAppointments = () => {
  const [username, setUsername] = useState('Admin');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  // Helper function to get token
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("adminToken");
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = getToken();
      console.log("Fetching appointments with token:", !!token);
      
      if (!token) {
        setError("No token found. Please login again.");
        setTimeout(() => navigate('/admin'), 2000);
        return;
      }

      let response = null;
      let endpoints = [
        `${API_BASE_URL_APPOINTMENTS}/getAppointment`,
        `${API_BASE_URL_APPOINTMENTS}/all`,
        `http://localhost:8080/admin/appointments`,
        `http://localhost:8080/api/appointments`
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
        let appointmentsData = Array.isArray(response.data) ? response.data : 
                               (response.data.appointments || response.data.content || []);
        
        // DEBUG: Log the first appointment to see all fields
        if (appointmentsData.length > 0) {
          console.log("===== APPOINTMENT DATA DEBUG =====");
          console.log("Full appointment object:", appointmentsData[0]);
          console.log("All keys in appointment:", Object.keys(appointmentsData[0]));
          console.log("==================================");
        }
        
        setAppointments(appointmentsData);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get customer email from appointment
  const getCustomerEmail = (appointment) => {
    // Try all possible locations for email
    if (appointment.email) return appointment.email;
    if (appointment.userEmail) return appointment.userEmail;
    if (appointment.customerEmail) return appointment.customerEmail;
    if (appointment.user?.email) return appointment.user.email;
    if (appointment.user?.userEmail) return appointment.user.userEmail;
    if (appointment.user?.username && appointment.user.username.includes('@')) return appointment.user.username;
    
    // If still not found, return the first field that looks like an email
    for (const key of Object.keys(appointment)) {
      if (typeof appointment[key] === 'string' && appointment[key].includes('@')) {
        return appointment[key];
      }
    }
    
    return 'No email field';
  };

  // Helper function to get customer name
  const getCustomerName = (appointment) => {
    if (appointment.user?.firstName || appointment.user?.lastName) {
      return `${appointment.user.firstName || ''} ${appointment.user.lastName || ''}`.trim();
    }
    if (appointment.firstName || appointment.lastName) {
      return `${appointment.firstName || ''} ${appointment.lastName || ''}`.trim();
    }
    if (appointment.name) return appointment.name;
    if (appointment.user?.username) return appointment.user.username;
    return 'N/A';
  };

  // Helper function to get contact number
  const getContactNumber = (appointment) => {
    if (appointment.contactNo) return appointment.contactNo;
    if (appointment.contactNumber) return appointment.contactNumber;
    if (appointment.user?.contactNo) return appointment.user.contactNo;
    return 'N/A';
  };

  const handleConfirm = async (appId) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized: No admin token found");
        return;
      }
      
      setUpdatingId(appId);
      
      const response = await axios.put(
        `${API_BASE_URL_APPOINTMENTS}/confirm/${appId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAppointments(appointments.map(app => 
          app.appId === appId ? { ...app, confirmed: true, canceled: false } : app
        ));
        setError('');
      } else {
        throw new Error("Failed to confirm appointment");
      }
    } catch (err) {
      console.error("Error confirming appointment:", err);
      setError(err.response?.data?.message || err.message || 'Failed to confirm appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (appId) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized: No admin token found");
        return;
      }
      
      setUpdatingId(appId);
      
      const response = await axios.put(
        `${API_BASE_URL_APPOINTMENTS}/cancel/${appId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAppointments(appointments.map(app => 
          app.appId === appId ? { ...app, canceled: true, confirmed: false } : app
        ));
        setError('');
      } else {
        throw new Error("Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError(err.response?.data?.message || err.message || 'Failed to cancel appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (appId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this appointment? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized: No admin token found");
        return;
      }
      
      setUpdatingId(appId);
      
      const response = await axios.delete(
        `${API_BASE_URL_APPOINTMENTS}/deleteAppointment/${appId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAppointments(appointments.filter(app => app.appId !== appId));
        setError('');
      } else {
        throw new Error("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError(err.response?.data?.message || err.message || 'Failed to delete appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const getServiceType = (appointment) => {
    if (appointment.groomService) return appointment.groomService;
    if (appointment.serviceType) return appointment.serviceType;
    return 'N/A';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-700">Loading Appointments...</h2>
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
              onClick={() => fetchAppointments()} 
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
          <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
          <button 
            onClick={() => navigate('/adminDashboard')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Customer Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Contact No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.appId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCustomerName(appointment)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCustomerEmail(appointment)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getContactNumber(appointment)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(appointment.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(appointment.time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getServiceType(appointment)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{appointment.price || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.canceled ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Canceled
                          </span>
                        ) : appointment.confirmed ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {!appointment.canceled && !appointment.confirmed && (
                            <>
                              <button
                                onClick={() => handleConfirm(appointment.appId)}
                                disabled={updatingId === appointment.appId}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                              >
                                {updatingId === appointment.appId ? '...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => handleCancel(appointment.appId)}
                                disabled={updatingId === appointment.appId}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                              >
                                {updatingId === appointment.appId ? '...' : 'Cancel'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(appointment.appId)}
                            disabled={updatingId === appointment.appId}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAppointments;