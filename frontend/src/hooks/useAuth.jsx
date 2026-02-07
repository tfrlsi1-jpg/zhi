import { useState, useContext, createContext, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

//const isProduction = window.location.hostname !== 'localhost';

// Uses shared `api` instance from src/lib/api.js

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      //const response = await axios.get('/api/auth/me', { withCredentials: true });
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.log('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      //const response = await axios.post('/api/auth/register', {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        confirmPassword,
     // }, { withCredentials: true });
     });

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      //const response = await axios.post('/api/auth/login', {
      const response = await api.post('/api/auth/login', {
        username,
        password,
     // }, { withCredentials: true });
      });

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      //await axios.post('/api/auth/logout', {}, { withCredentials: true });
      await api.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
