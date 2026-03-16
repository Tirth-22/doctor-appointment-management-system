import React from 'react';
import { Star, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DoctorCard({ doctor, onBookClick }) {
  const { user } = useAuth();
  const isRestrictedRole = user?.role === 'DOCTOR' || user?.role === 'ADMIN';
  const averageRating = Number(doctor.averageRating || 0);
  const ratingCount = Number(doctor.ratingCount || 0);

  const renderStarClass = (index) => {
    const starValue = index + 1;
    if (averageRating >= starValue) {
      return 'fill-yellow-400 text-yellow-400';
    }
    if (averageRating >= starValue - 0.5) {
      return 'fill-yellow-200 text-yellow-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="bg-medical-600 h-32 flex items-center justify-center">
        <div className="w-20 h-20 bg-medical-50 rounded-full flex items-center justify-center text-2xl font-bold text-medical-600">
          {doctor.name?.charAt(0)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
        
        <div className="flex items-center space-x-1 text-medical-600 my-2">
          <Briefcase size={16} />
          <span className="text-sm">{doctor.specialization}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 flex items-start space-x-1">
          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
          <span>{doctor.hospital}</span>
        </p>

        <p className="text-sm text-gray-600 mb-3">{doctor.experience} years experience</p>
        
        <p className="text-gray-600 text-sm mb-4">{doctor.bio}</p>

        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={renderStarClass(i)} />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {ratingCount > 0 ? `${averageRating.toFixed(1)} (${ratingCount})` : 'No ratings yet'}
          </span>
        </div>

        <button
          onClick={() => onBookClick(doctor)}
          disabled={isRestrictedRole}
          className={`w-full py-2 rounded-lg font-medium transition ${
            isRestrictedRole
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-medical-600 text-white hover:bg-medical-700'
          }`}
          title={isRestrictedRole ? 'You cannot book appointments' : 'Book an appointment'}
        >
          {isRestrictedRole ? 'Not Available' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}
