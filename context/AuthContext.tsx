'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  getGoogleAuthUrl: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (token) {
          setIsAuthenticated(true);
          await fetchUserData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth-service/api/v1/auth/login', {
      email,
      password
    });

    const { accessToken, refreshToken } = response.data;
    
    // Store tokens in cookies
    Cookies.set('accessToken', accessToken, { expires: 1, secure: true });
    Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true });
    
    // Set authentication state
    setIsAuthenticated(true);
    
    // Fetch user data
    await fetchUserData();
  };

  const logout = () => {
    // Remove tokens
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    
    // Clear user data and auth state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page (handled by component)
  };

  const fetchUserData = async () => {
    try {
      // Doğru endpoint'i kullanın - backend yapılandırmasına göre
      const response = await api.get('/auth-service/api/v1/auth/me');
      const userData = response.data;
      
      setUser(userData);
      
      // Store user data in cookie for persistence
      Cookies.set('user', JSON.stringify(userData), { expires: 1 });
      
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // 403 hatası durumunda token geçersiz olabilir
      if (error.response?.status === 403 || error.response?.status === 401) {
        // Token'ları temizle ve login sayfasına yönlendir
        logout();
      }
      
      throw error;
    }
  };

  const getGoogleAuthUrl = async () => {
    try {
      // Doğru endpoint'i kullanın
      const response = await api.get('/auth-service/api/v1/oauth2/google/url');
      console.log('Google auth URL response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        fetchUserData,
        getGoogleAuthUrl
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}