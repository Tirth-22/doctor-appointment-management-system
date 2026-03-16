import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import BookAppointmentModal from '../components/BookAppointmentModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { doctorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Heart, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage: Fetching doctors...');
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorApi.getAllDoctors();
      console.log('HomePage: Doctors fetched:', response?.data);
      setDoctors(response?.data?.data || response?.data || []);
    } catch (error) {
      console.error('HomePage: Error fetching doctors:', error?.message);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (doctor) => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
  };

  const handleBookingSuccess = (message) => {
    toast.success(message);
    setSelectedDoctor(null);
    navigate('/appointments');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Doctor Appointments Easily
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with the best doctors in your area. Schedule appointments at your convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/doctors"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Find Doctors
              </Link>
              <Link
                to={isAuthenticated ? "/appointments" : "/register"}
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {isAuthenticated ? 'View Appointments' : 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose DoctorCare?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Expert Doctors</h3>
              <p className="text-gray-600">Verified and experienced professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Booking</h3>
              <p className="text-gray-600">Schedule at your convenience</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Quality Care</h3>
              <p className="text-gray-600">Professional healthcare service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors - Hidden for Doctor Users */}
      {user?.role !== 'DOCTOR' && (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Featured Doctors</h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : doctors && doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.slice(0, 6).map((doctor) => (
                <DoctorCard
                  key={doctor.id || doctor.userId}
                  doctor={doctor}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No doctors available</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/doctors"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
      )}

      {selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
