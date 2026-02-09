import axios from 'axios';

// Prefer explicit VITE_API_URL; fall back to localhost in dev, production host in prod
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://zhi-production.up.railway.app' : 'http://localhost:3001');

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export default api;
