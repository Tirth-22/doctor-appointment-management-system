import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doctorApi, feedbackApi, availabilityApi } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Star, MessageSquare, Clock, Plus, Trash2 } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

function DoctorProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    hospital: '',
    bio: ''
  });

  const profileChecklist = [
    {
      key: 'specialization',
      label: 'Select your specialization',
      complete: !!formData.specialization,
    },
    {
      key: 'experience',
      label: 'Add years of experience',
      complete: formData.experience !== '' && Number(formData.experience) >= 0,
    },
    {
      key: 'hospital',
      label: 'Add hospital or clinic name',
      complete: !!formData.hospital.trim(),
    },
    {
      key: 'bio',
      label: 'Write a short professional bio',
      complete: !!formData.bio.trim(),
    },
  ];
  const remainingChecklistItems = profileChecklist.filter((item) => !item.complete);

  useEffect(() => {
    if (user?.role !== 'DOCTOR') {
      toast.error('Only doctors can access this page');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadDoctorFeedback = async () => {
      if (!user?.id || user?.role !== 'DOCTOR') {
        return;
      }

      setLoadingFeedback(true);
      try {
        // Find doctor profile id by current user id.
        const doctorsResponse = await doctorApi.getAllDoctors();
        const doctors = doctorsResponse.data?.data || [];
        const myDoctorProfile = doctors.find((d) => d.userId === user.id);

        if (!myDoctorProfile?.id) {
          setFeedbacks([]);
          setAverageRating(0);
          setFeedbackCount(0);
          return;
        }

        const doctorId = myDoctorProfile.id;
        const [feedbackResponse, ratingResponse, countResponse] = await Promise.all([
          feedbackApi.getDoctorFeedback(doctorId),
          feedbackApi.getDoctorRating(doctorId),
          feedbackApi.getDoctorFeedbackCount(doctorId),
        ]);

        setFeedbacks(feedbackResponse.data?.data || []);
        setAverageRating(ratingResponse.data?.data || 0);
        setFeedbackCount(countResponse.data?.data || 0);
      } catch (error) {
        console.error('Error loading doctor feedback:', error);
      } finally {
        setLoadingFeedback(false);
      }
    };

    loadDoctorFeedback();
  }, [user]);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!user?.id || user?.role !== 'DOCTOR') {
        return;
      }

      setLoadingAvailability(true);
      try {
        const response = await availabilityApi.getMyAvailability();
        setAvailabilitySlots(response.data?.data || []);
      } catch (error) {
        console.error('Error loading availability:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.specialization.trim()) {
      toast.error('Specialization is required');
      return;
    }
    if (!formData.experience) {
      toast.error('Experience is required');
      return;
    }
    if (!formData.hospital.trim()) {
      toast.error('Hospital is required');
      return;
    }

    setLoading(true);
    try {
      await doctorApi.updateProfile(user.id, formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    if (!slotForm.dayOfWeek || !slotForm.startTime || !slotForm.endTime) {
      toast.error('Please select day, start time, and end time');
      return;
    }

    if (slotForm.startTime >= slotForm.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setAvailabilitySlots((prev) => [...prev, { ...slotForm }]);
  };

  const handleRemoveSlot = (indexToRemove) => {
    setAvailabilitySlots((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveWeeklySchedule = async () => {
    setSavingAvailability(true);
    try {
      const payload = availabilitySlots.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      const response = await availabilityApi.saveWeeklySchedule(payload, true);
      setAvailabilitySlots(response.data?.data || []);
      toast.success('Weekly schedule saved successfully');
    } catch (error) {
      console.error('Error saving weekly schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to save weekly schedule');
    } finally {
      setSavingAvailability(false);
    }
  };

  const slotsByDay = DAYS.map((day) => ({
    day,
    slots: availabilitySlots
      .filter((slot) => slot.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            <strong>Welcome, {user?.name}!</strong><br/>
            Please fill in your professional details to appear in the doctor directory.
          </p>
        </div>

        {remainingChecklistItems.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="text-amber-800 font-semibold mb-2">Profile completion tips</p>
            <ul className="text-amber-700 text-sm space-y-1">
              {remainingChecklistItems.map((item) => (
                <li key={item.key}>• {item.label}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialization *
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="General Practice">General Practice</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="ENT">ENT (Ear, Nose, Throat)</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Urology">Urology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 10"
              min="0"
              max="70"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hospital / Clinic Name *
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="e.g., City General Hospital"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio / Professional Summary
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell patients about your expertise, approach, and qualifications..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <p className="text-amber-700 text-sm">
              <strong>Next Steps:</strong> After saving, you can add your availability schedule to allow patients to book appointments.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Weekly Availability
            </h2>
            <button
              type="button"
              onClick={handleSaveWeeklySchedule}
              disabled={savingAvailability}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {savingAvailability ? 'Saving...' : 'Save Weekly Schedule'}
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-3 mb-6">
            <select
              value={slotForm.dayOfWeek}
              onChange={(e) => setSlotForm((prev) => ({ ...prev, dayOfWeek: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <input
              type="time"
              value={slotForm.startTime}
              onChange={(e) => setSlotForm((prev) => ({ ...prev, startTime: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="time"
              value={slotForm.endTime}
              onChange={(e) => setSlotForm((prev) => ({ ...prev, endTime: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <button
              type="button"
              onClick={handleAddSlot}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Slot
            </button>
          </div>

          {loadingAvailability ? (
            <p className="text-gray-600">Loading schedule...</p>
          ) : (
            <div className="space-y-4">
              {slotsByDay.map(({ day, slots }) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{day}</h3>
                  {slots.length === 0 ? (
                    <p className="text-sm text-gray-500">No slots</p>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((slot, index) => {
                        const globalIndex = availabilitySlots.findIndex(
                          (item) =>
                            item.dayOfWeek === slot.dayOfWeek &&
                            item.startTime === slot.startTime &&
                            item.endTime === slot.endTime
                        );

                        return (
                          <div key={`${day}-${index}`} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                            <span className="text-gray-700">{slot.startTime} - {slot.endTime}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(globalIndex)}
                              className="text-red-600 hover:text-red-700"
                              title="Remove slot"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={24} className="text-blue-600" />
              Patient Feedback
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-xl font-semibold text-gray-800 flex items-center gap-1 justify-end">
                <Star size={18} className="text-yellow-500 fill-yellow-400" />
                {Number(averageRating || 0).toFixed(1)} ({feedbackCount})
              </p>
            </div>
          </div>

          {loadingFeedback ? (
            <p className="text-gray-600">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600">No feedback yet. Completed appointments with feedback will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">{item.patientName || 'Patient'}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-400" />
                      {item.rating}/5
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">{item.comment || 'No comment provided.'}</p>
                  <p className="text-xs text-gray-500">
                    Recommend: {item.wouldRecommend ? 'Yes' : 'No'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
