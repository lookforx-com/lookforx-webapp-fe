import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS için önemli - cookie'leri gönderir
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Adding token to request: ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', error.response?.status, error.response?.data, originalRequest.url);
    
    // If error is 401 or 403 and we haven't tried to refresh token yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = Cookies.get('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        // Try to get a new token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );
        
        if (response.data.accessToken) {
          // Update tokens
          Cookies.set('accessToken', response.data.accessToken, { path: '/' });
          if (response.data.refreshToken) {
            Cookies.set('refreshToken', response.data.refreshToken, { path: '/' });
          }
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Refresh token failed, redirect to login
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('user', { path: '/' });
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
