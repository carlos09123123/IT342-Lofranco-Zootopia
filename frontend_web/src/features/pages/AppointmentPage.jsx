import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Label } from '@shared/components/Label';
import { Calendar, Clock, X, Scissors, Home } from 'lucide-react';
import Footer from '@shared/components/Footer';
import { toast } from 'sonner';

const API_BASE_URL_USER_APPOINTMENT = 'http://localhost:8080/appointments';

export default function AppointmentPage() {
  const [contactNo, setContactNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [modalData, setModalData] = useState({ service: "", date: "", time: "", price: "" });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get current date and time for restrictions
  const today = new Date();
  const currentTime = today.toTimeString().slice(0, 5);
  const shopOpenTime = "08:00";
  const shopCloseTime = "20:00";
  const minDate = currentTime > shopCloseTime 
    ? new Date(today.setDate(today.getDate() + 1)).toISOString().split("T")[0]
    : today.toISOString().split("T")[0];

  const validateForm = () => {
    let formErrors = {};
    
    if (!contactNo) formErrors.contactNo = "Contact number is required";
    if (!service) formErrors.service = "Please select a service";
    if (!price) formErrors.price = "Please select a price";
    if (!date) {
      formErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(date);
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (selectedDate < minDateObj) {
        formErrors.date = "Date cannot be in the past";
      }
    }
    if (!time) {
      formErrors.time = "Time is required";
    } else {
      if (time < shopOpenTime || time > shopCloseTime) {
        formErrors.time = "Time must be between 8:00 AM and 8:00 PM";
      }
      if (date === minDate && time < currentTime) {
        formErrors.time = "Time cannot be in the past for today";
      }
    }
    
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    
    const localUser = JSON.parse(localStorage.getItem("user") || "null");
    const googleUser = JSON.parse(localStorage.getItem("googleuser") || "null");
    
    console.log("Local user:", localUser);
    console.log("Google user:", googleUser);
  
    if (!localUser && !googleUser) {
      console.log("No user found");
      toast.error('Please log in first.');
      return;
    }
  
    if (!token) {
      console.log("No token found");
      toast.error("You need to be logged in to book an appointment");
      return;
    }
  
    const formErrors = validateForm();
    console.log("Form errors:", formErrors);
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      console.log("Form is valid, submitting...");
      setIsSubmitting(true);
  
      try {
        const userId = localUser?.userId || localUser?.id || googleUser?.userId || googleUser?.id;
        const email = localUser?.email || googleUser?.email;
        
        const appointmentData = {
          email: email,
          contactNo: contactNo,
          date: date,
          time: time,
          groomService: service,
          price: parseInt(price),
          confirmed: false,
          canceled: false,
          user: {
            userId: userId,
          },
        };
  
        console.log("Sending appointment data:", appointmentData);
        console.log("API URL:", `${API_BASE_URL_USER_APPOINTMENT}/postAppointment`);
  
        const response = await fetch(`${API_BASE_URL_USER_APPOINTMENT}/postAppointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(appointmentData),
        });
  
        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response data:", responseData);
  
        if (response.ok) {
          setModalData({ service, date, time, price });
          setBookingSuccess(true);
          setContactNo("");
          setDate("");
          setTime("");
          setService("");
          setPrice("");
          toast.success("Appointment booked successfully!");
        } else {
          console.error("Failed to book appointment:", responseData);
          toast.error(responseData.message || responseData || "Failed to book appointment");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form has errors:", formErrors);
      toast.error("Please fix the errors in the form");
    }
  };

  const handleServiceChange = (value, servicePrice) => {
    setService(value);
    setPrice(servicePrice.toString());
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Success Modal */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-700">Booking Confirmed!</h3>
              <button 
                onClick={() => setBookingSuccess(false)}
                className="text-gray-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p>Your Zootopia appointment has been successfully booked.</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Service:</p>
                  <p className="font-medium">{modalData.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date:</p>
                  <p className="font-medium">{modalData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time:</p>
                  <p className="font-medium">{modalData.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total:</p>
                  <p className="font-medium text-red-600">₱{modalData.price}</p>
                </div>
              </div>
              <Button 
                onClick={() => setBookingSuccess(false)}
                className="w-full mt-4 rounded-full bg-red-600 hover:bg-red-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 bg-gray-50">
        <form onSubmit={handleSubmit}>
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Book an Appointment</h1>
                <p className="text-gray-600 mt-2">Schedule a grooming or boarding session for your beloved pet</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Personal Information Column */}
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6 text-red-700">Personal Information</h2>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="contactNo">Contact Number</Label>
                        <Input 
                          id="contactNo" 
                          value={contactNo}
                          onChange={(e) => setContactNo(e.target.value)}
                          placeholder="Enter your contact number"
                          className={`rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.contactNo ? 'border-red-500' : ''}`}
                        />
                        {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Selection Column */}
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6 text-red-700">Service Selection</h2>
                    <div className="space-y-6">
                      
                      {/* Service Options */}
                      <div className="grid gap-2">
                        <Label>Service Type</Label>
                        <div className="space-y-3">
                          <div 
                            onClick={() => handleServiceChange("Grooming", 500)}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition ${
                              service === "Grooming" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                            }`}
                          >
                            <input
                              type="radio"
                              id="grooming"
                              name="service"
                              value="Grooming"
                              checked={service === "Grooming"}
                              onChange={() => handleServiceChange("Grooming", 500)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                            />
                            <Scissors className={`w-5 h-5 ${service === "Grooming" ? "text-red-600" : "text-gray-400"}`} />
                            <Label htmlFor="grooming" className="font-normal cursor-pointer flex-1">
                              Grooming - ₱500
                            </Label>
                          </div>
                          
                          <div 
                            onClick={() => handleServiceChange("Boarding", 1000)}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition ${
                              service === "Boarding" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                            }`}
                          >
                            <input
                              type="radio"
                              id="boarding"
                              name="service"
                              value="Boarding"
                              checked={service === "Boarding"}
                              onChange={() => handleServiceChange("Boarding", 1000)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                            />
                            <Home className={`w-5 h-5 ${service === "Boarding" ? "text-red-600" : "text-gray-400"}`} />
                            <Label htmlFor="boarding" className="font-normal cursor-pointer flex-1">
                              Boarding - ₱1000
                            </Label>
                          </div>
                        </div>
                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6 text-red-700">Appointment Details</h2>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            id="date" 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={minDate}
                            className={`pl-10 rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.date ? 'border-red-500' : ''}`}
                          />
                          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            id="time" 
                            type="time" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            min={shopOpenTime}
                            max={shopCloseTime}
                            step="300"
                            className={`pl-10 rounded-lg focus:ring-red-500 focus:border-red-500 ${errors.time ? 'border-red-500' : ''}`}
                          />
                          {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary and Submit */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-red-600">₱{price || 0}</span>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full rounded-full bg-red-600 hover:bg-red-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Book Appointment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>
      <Footer />
    </div>
  );
}