import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`, config);
          setUser({ ...data, token });
        } catch (error) {
          console.error('Error fetching user data', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const register = async (name, email, password, role) => {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, role });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
