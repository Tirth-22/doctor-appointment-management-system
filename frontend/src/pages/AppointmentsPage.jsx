import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import FeedbackModal from '../components/FeedbackModal';
import { appointmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Stethoscope, AlertCircle, Trash2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [feedbackAppointment, setFeedbackAppointment] = useState(null);
  const [feedbackDoctor, setFeedbackDoctor] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = user?.role === 'DOCTOR'
        ? await appointmentApi.getDoctorAppointments()
        : await appointmentApi.getMyAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setActionInProgress(appointmentId);
      await appointmentApi.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Unable to cancel appointment right now.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleAccept = async (appointmentId) => {
    if (!window.confirm('Confirm appointment acceptance?')) {
      return;
    }

    try {
      setActionInProgress(appointmentId);
      await appointmentApi.acceptAppointment(appointmentId);
      toast.success('Appointment accepted successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error accepting appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to accept appointment');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to reject this appointment?')) {
      return;
    }

    try {
      setActionInProgress(appointmentId);
      await appointmentApi.rejectAppointment(appointmentId);
      toast.success('Appointment rejected successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleComplete = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as completed?')) {
      return;
    }

    try {
      setActionInProgress(appointmentId);
      await appointmentApi.updateStatus(appointmentId, 'COMPLETED');
      toast.success('Appointment marked as completed');
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to mark appointment as completed');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleFeedback = (appointment) => {
    setFeedbackAppointment(appointment);
    setFeedbackDoctor({
      name: appointment.doctorName,
      specialization: appointment.doctorSpecialization,
      id: appointment.doctorId,
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
          {user?.role === 'DOCTOR' ? 'Pending Appointments' : 'My Appointments'}
        </h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 sm:mb-8 border-b overflow-x-auto whitespace-nowrap pb-2">
          {user?.role === 'DOCTOR' 
            ? ['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 capitalize font-medium transition ${
                    filter === status
                      ? 'text-medical-600 border-b-2 border-medical-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {status}
                </button>
              ))
            : ['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 capitalize font-medium transition ${
                    filter === status
                      ? 'text-medical-600 border-b-2 border-medical-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {status}
                </button>
              ))
          }
        </div>

        {/* Appointments List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div>
                    {user?.role === 'DOCTOR' ? (
                      <>
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                          <User size={24} className="text-medical-600" />
                          <span>{appointment.patientName}</span>
                        </h3>
                        <p className="text-sm text-gray-600 ml-0 sm:ml-8">Patient</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                          <Stethoscope size={24} className="text-medical-600" />
                          <span>{appointment.doctorName}</span>
                        </h3>
                        <p className="text-sm text-gray-600 ml-0 sm:ml-8">{appointment.doctorSpecialization}</p>
                      </>
                    )}
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 ml-0 sm:ml-8">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar size={18} className="text-medical-600" />
                    <span>
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock size={18} className="text-medical-600" />
                    <span>{appointment.appointmentTime}</span>
                  </div>
                  {user?.role === 'DOCTOR' && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User size={18} className="text-medical-600" />
                      <span>{appointment.patientName}</span>
                    </div>
                  )}
                </div>

                {appointment.notes && (
                  <div className="ml-0 sm:ml-8 mb-4 p-4 bg-blue-50 rounded-lg flex space-x-2">
                    <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Notes</p>
                      <p className="text-sm text-blue-800">{appointment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Doctor Actions */}
                {user?.role === 'DOCTOR' && appointment.status === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                      onClick={() => handleReject(appointment.id)}
                      disabled={actionInProgress === appointment.id}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle size={18} />
                      <span>{actionInProgress === appointment.id ? 'Processing...' : 'Reject'}</span>
                    </button>
                    <button
                      onClick={() => handleAccept(appointment.id)}
                      disabled={actionInProgress === appointment.id}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={18} />
                      <span>{actionInProgress === appointment.id ? 'Processing...' : 'Accept'}</span>
                    </button>
                  </div>
                )}

                {/* Patient Actions */}
                {user?.role !== 'DOCTOR' && appointment.status === 'PENDING' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      disabled={actionInProgress === appointment.id}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                      <span>{actionInProgress === appointment.id ? 'Processing...' : 'Cancel'}</span>
                    </button>
                  </div>
                )}

                {user?.role !== 'DOCTOR' && appointment.status === 'CONFIRMED' && (
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      disabled={actionInProgress === appointment.id}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                      <span>{actionInProgress === appointment.id ? 'Processing...' : 'Cancel'}</span>
                    </button>
                    <button
                      onClick={() => handleComplete(appointment.id)}
                      disabled={actionInProgress === appointment.id}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={18} />
                      <span>{actionInProgress === appointment.id ? 'Processing...' : 'Mark Completed'}</span>
                    </button>
                  </div>
                )}

                {/* Patient Feedback Button */}
                {user?.role !== 'DOCTOR' && appointment.status === 'COMPLETED' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFeedback(appointment)}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
                    >
                      <MessageSquare size={18} />
                      <span>Leave Feedback</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {filter === 'all'
                ? user?.role === 'DOCTOR'
                  ? 'No appointments assigned to you'
                  : 'No appointments booked yet'
                : `No ${filter} appointments`}
            </p>
            {user?.role !== 'DOCTOR' && filter === 'all' && (
              <Link
                to="/doctors"
                className="inline-block mt-4 px-5 py-2.5 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition"
              >
                Book your first appointment
              </Link>
            )}
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackAppointment && feedbackDoctor && (
          <FeedbackModal
            appointment={feedbackAppointment}
            doctor={feedbackDoctor}
            onClose={() => {
              setFeedbackAppointment(null);
              setFeedbackDoctor(null);
            }}
            onSuccess={fetchAppointments}
          />
        )}
      </div>
    </div>
  );
}
