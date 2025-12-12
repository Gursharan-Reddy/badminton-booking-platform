import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  return process.env.REACT_APP_RENDER_API_URL || 'https://badminton-booking-platform.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);

export const getCourts = () => api.get('/courts');
export const getCoaches = () => api.get('/coaches');
export const getEquipment = () => api.get('/admin/equipment');
export const getBookings = () => api.get('/bookings');

export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const checkLivePrice = (data) => api.post('/bookings/price-check', data);

export const adminAddCourt = (data) => api.post('/admin/courts', data);
export const adminUpdateCourt = (id, data) => api.put(`/admin/courts/${id}`, data);
export const adminUpdateEquipment = (name, data) => api.put(`/admin/equipment/${name}`, data);
export const adminAddRule = (data) => api.post('/admin/rules', data);
export const adminUpdateRule = (id, data) => api.put(`/admin/rules/${id}`, data);

export default api;