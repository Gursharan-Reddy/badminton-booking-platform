import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

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