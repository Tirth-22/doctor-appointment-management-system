import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Doctor APIs
export const doctorApi = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  searchDoctors: (query) => api.get(`/doctors/search?query=${encodeURIComponent(query)}`),
  searchByName: (name) => api.get(`/doctors/search/name?name=${encodeURIComponent(name)}`),
  searchBySpecialization: (spec) => api.get(`/doctors/search/specialization?specialization=${encodeURIComponent(spec)}`),
  searchByHospital: (hospital) => api.get(`/doctors/search/hospital?hospital=${encodeURIComponent(hospital)}`),
  updateProfile: (userId, data) => api.put(`/doctors/${userId}`, data),
};

// Patient APIs
export const patientApi = {
  getProfile: () => api.get('/patients/me'),
  updateProfile: (data) => api.put('/patients/me', data),
};

// Appointment APIs
export const appointmentApi = {
  bookAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
  getDoctorAppointments: () => api.get('/appointments/doctor/my'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status?status=${status}`),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
  acceptAppointment: (id) => api.put(`/appointments/${id}/accept`),
  rejectAppointment: (id) => api.put(`/appointments/${id}/reject`),
};

// Feedback APIs
export const feedbackApi = {
  submitFeedback: (appointmentId, data) => api.post(`/feedback/appointment/${appointmentId}`, data),
  getDoctorFeedback: (doctorId) => api.get(`/feedback/doctor/${doctorId}`),
  getDoctorRating: (doctorId) => api.get(`/feedback/doctor/${doctorId}/rating`),
  getDoctorFeedbackCount: (doctorId) => api.get(`/feedback/doctor/${doctorId}/count`),
  getMyFeedback: () => api.get('/feedback/patient/my'),
  getFeedback: (feedbackId) => api.get(`/feedback/${feedbackId}`),
};

// Availability APIs
export const availabilityApi = {
  addAvailability: (data) => api.post('/availability', data),
  saveWeeklySchedule: (slots, replaceExisting = true) =>
    api.post(`/availability/weekly?replaceExisting=${replaceExisting}`, slots),
  getMyAvailability: () => api.get('/availability/my'),
  getAvailabilityByDoctor: (doctorId) => api.get(`/availability/doctor/${doctorId}`),
  getAvailabilityByDoctorAndDay: (doctorId, day) => 
    api.get(`/availability/doctor/${doctorId}/day/${day}`),
  deleteAvailability: (id) => api.delete(`/availability/${id}`),
};

// Admin APIs
export const adminApi = {
  getAllUsers: () => api.get('/admin/users'),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  deleteUser: (userId) => api.delete(`/admin/user/${userId}`),
};

export default api;
