import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import BookAppointmentModal from '../components/BookAppointmentModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { doctorApi, feedbackApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('fullText');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      filterDoctors();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm, searchType, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorApi.getAllDoctors();
      const rawDoctors = response.data.data || [];
      const doctorsWithRatings = await Promise.all(
        rawDoctors.map(async (doctor) => {
          try {
            const [ratingRes, countRes] = await Promise.all([
              feedbackApi.getDoctorRating(doctor.id),
              feedbackApi.getDoctorFeedbackCount(doctor.id),
            ]);

            return {
              ...doctor,
              averageRating: ratingRes.data?.data || 0,
              ratingCount: countRes.data?.data || 0,
            };
          } catch (ratingError) {
            return {
              ...doctor,
              averageRating: 0,
              ratingCount: 0,
            };
          }
        })
      );

      setDoctors(doctorsWithRatings);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = async () => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
    } else {
      try {
        let response;
        switch (searchType) {
          case 'name':
            response = await doctorApi.searchByName(searchTerm);
            break;
          case 'specialization':
            response = await doctorApi.searchBySpecialization(searchTerm);
            break;
          case 'hospital':
            response = await doctorApi.searchByHospital(searchTerm);
            break;
          default:
            response = await doctorApi.searchDoctors(searchTerm);
            break;
        }

        const searchedDoctors = response.data.data || [];
        const searchedWithRatings = await Promise.all(
          searchedDoctors.map(async (doctor) => {
            try {
              const [ratingRes, countRes] = await Promise.all([
                feedbackApi.getDoctorRating(doctor.id),
                feedbackApi.getDoctorFeedbackCount(doctor.id),
              ]);

              return {
                ...doctor,
                averageRating: ratingRes.data?.data || 0,
                ratingCount: countRes.data?.data || 0,
              };
            } catch (ratingError) {
              return {
                ...doctor,
                averageRating: 0,
                ratingCount: 0,
              };
            }
          })
        );

        setFilteredDoctors(searchedWithRatings);
      } catch (error) {
        console.error('Error searching doctors:', error);
        toast.error('Search failed');
        setFilteredDoctors([]);
      }
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
    navigate('/appointments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12">Find Doctors</h1>

        {/* Search Bar */}
        <div className="mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent text-base sm:text-lg"
            />
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
          >
            <option value="fullText">Full Text</option>
            <option value="name">Name</option>
            <option value="specialization">Specialization</option>
            <option value="hospital">Hospital</option>
          </select>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredDoctors.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No doctors found matching your search' : 'No doctors available'}
            </p>
          </div>
        )}

        {/* Modal */}
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
