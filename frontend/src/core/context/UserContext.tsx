// src/core/context/UserContext.tsx - Debug Version
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../utils/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, skipping API call');
        setLoading(false);
        return;
      }

      const response = await authApi.me();
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        console.log('API call failed or no data:', response);
        // Token might be invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError('Session expired. Please login again.');
      }
    } catch (error: any) {
      console.error('Error in fetchUser:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Don't show error if it's just unauthorized (user not logged in)
      if (!error.message?.includes('Unauthorized')) {
        setError('Failed to load user data');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authApi.logout();
    } catch (error: any) {
      console.error('Logout API error:', error);
      // Don't show error to user for logout issues
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Debug logging when user state changes
  useEffect(() => {
  }, [user]);

  useEffect(() => {
  }, [loading]);

  const value = {
    user,
    loading,
    error,
    setUser,
    logout,
    fetchUser,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};