import axios from 'axios';

// Change this to your actual backend URL when deployed
// For now, using localhost (your WhatsApp bot backend)
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all fraud reports
export const getReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

// Get pending reports only
export const getPendingReports = async () => {
  const response = await api.get('/reports/pending');
  return response.data;
};

// Verify a report (mark as verified fraud)
export const verifyReport = async (reportId) => {
  const response = await api.put(`/reports/${reportId}/verify`);
  return response.data;
};

// Reject a report (mark as false report)
export const rejectReport = async (reportId) => {
  const response = await api.put(`/reports/${reportId}/reject`);
  return response.data;
};

// Get dashboard stats
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export default api;