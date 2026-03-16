import React, { useState } from 'react';
import { X } from 'lucide-react';
import { appointmentApi } from '../services/api';

export default function BookAppointmentModal({ doctor, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.appointmentDate && formData.appointmentDate < minDate) {
      alert('You cannot book an appointment in the past.');
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
      alert(error.response?.data?.message || 'Failed to book appointment');
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
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <input
                type="time"
                required
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                className="w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-medical-600 focus:border-transparent"
              />
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
