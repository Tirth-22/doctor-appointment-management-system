import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { appointmentApi, availabilityApi } from '../services/api';
import toast from 'react-hot-toast';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function BookAppointmentModal({ doctor, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [errors, setErrors] = useState({
    appointmentDate: '',
    appointmentTime: '',
  });

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (!doctor?.id) {
        return;
      }

      setLoadingAvailability(true);
      try {
        const response = await availabilityApi.getAvailabilityByDoctor(doctor.id);
        setAvailabilitySlots(response.data?.data || []);
      } catch (error) {
        setAvailabilitySlots([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchDoctorAvailability();
  }, [doctor?.id]);

  const slotsByDay = DAYS.map((day) => ({
    day,
    slots: availabilitySlots
      .filter((slot) => slot.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((entry) => entry.slots.length > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      appointmentDate: '',
      appointmentTime: '',
    };

    if (!formData.appointmentDate) {
      nextErrors.appointmentDate = 'Please select an appointment date.';
    } else if (formData.appointmentDate < minDate) {
      nextErrors.appointmentDate = 'Appointment date cannot be in the past.';
    }

    if (!formData.appointmentTime) {
      nextErrors.appointmentTime = 'Please select a preferred time.';
    }

    setErrors(nextErrors);

    if (nextErrors.appointmentDate || nextErrors.appointmentTime) {
      return;
    }

    setLoading(true);

    try {
      await appointmentApi.bookAppointment({
        doctorId: doctor.id,
        ...formData,
      });
      
      onSuccess('Appointment booked successfully!');
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Unable to book appointment right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white shadow-xl w-full max-w-md h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-lg flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 -mr-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
            <p className="font-semibold text-gray-800">{doctor.name}</p>
            <p className="text-sm text-gray-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-600 mt-1">
              Fee: {typeof doctor.consultationFee === 'number'
                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(doctor.consultationFee)
                : 'Not set'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Address: {doctor.address || doctor.hospital || 'Not set'}</p>
          </div>

          <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
            <p className="text-sm font-semibold text-gray-800 mb-2">Doctor Availability</p>
            {loadingAvailability ? (
              <p className="text-sm text-gray-500">Loading availability...</p>
            ) : slotsByDay.length === 0 ? (
              <p className="text-sm text-gray-500">No availability set yet.</p>
            ) : (
              <div className="space-y-2">
                {slotsByDay.map(({ day, slots }) => (
                  <div key={day} className="text-sm text-gray-700">
                    <span className="font-medium">{day}:</span>{' '}
                    {slots.map((slot) => `${slot.startTime}-${slot.endTime}`).join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                required
                min={minDate}
                value={formData.appointmentDate}
                onChange={(e) => {
                  setFormData({ ...formData, appointmentDate: e.target.value });
                  setErrors((prev) => ({ ...prev, appointmentDate: '' }));
                }}
                className="w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
              />
              {errors.appointmentDate && (
                <p className="text-xs text-red-600 mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <input
                type="time"
                required
                value={formData.appointmentTime}
                onChange={(e) => {
                  setFormData({ ...formData, appointmentTime: e.target.value });
                  setErrors((prev) => ({ ...prev, appointmentTime: '' }));
                }}
                className="w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
              />
              {errors.appointmentTime && (
                <p className="text-xs text-red-600 mt-1">{errors.appointmentTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
                placeholder="Enter any additional information..."
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3 sm:pt-4 pb-4 sm:pb-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 w-full px-4 py-2.5 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 w-full px-4 py-2.5 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
