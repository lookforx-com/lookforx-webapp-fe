'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Cookies from 'js-cookie';
import { FiRefreshCw, FiLogOut } from 'react-icons/fi';
import { Button } from '@/components/ui/button/Button';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading, fetchUserData, logout } = useAuth();
  const { t } = useLanguage();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    status: 'success' | 'error' | 'info';
    isVisible: boolean;
  } | null>(null);

  // Token'ı alma fonksiyonu
  const getToken = () => {
    // Önce cookie'den kontrol et
    const cookieToken = Cookies.get('accessToken');
    if (cookieToken) {
      return cookieToken;
    }
    
    // Cookie'de yoksa localStorage'dan kontrol et
    return localStorage.getItem('accessToken');
  };

  // Toast gösterme fonksiyonu
  const showToast = (title: string, description: string, status: 'success' | 'error' | 'info') => {
    setToast({ title, description, status, isVisible: true });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Kullanıcı bilgilerini güncelle
  useEffect(() => {
    const updateUserInfo = async () => {
      try {
        // Token kontrolü
        const token = getToken();
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push('/login');
          return;
        }
        
        // Önce cookie'den kullanıcı bilgilerini kontrol et
        const userFromCookie = Cookies.get('user');
        if (userFromCookie) {
          try {
            // Cookie'den kullanıcı bilgilerini çöz
            const decodedCookie = decodeURIComponent(userFromCookie.replace(/\+/g, ' '));
            const userData = JSON.parse(decodedCookie);
            console.log("User data loaded from cookie:", userData);
            return;
          } catch (e) {
            console.error("Failed to parse user data from cookie:", e);
          }
        }
        
        console.log("Dashboard: Token found, fetching user data");
        await fetchUserData();
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Sadece kullanıcı bilgisi yoksa hata göster
        if (!user) {
          showToast(t('common.error'), t('dashboard.userDataError'), 'error');
        }
      }
    };
    
    updateUserInfo();
  }, [fetchUserData, router, user, t]);

  // Hoş geldin mesajını güncelle
  useEffect(() => {
    if (user?.name) {
      console.log("Setting welcome message for user:", user.name);
      // URL decode işlemi yaparken + işaretlerini boşluğa çevir
      const decodedName = user.name.replace(/\+/g, ' ');
      // Süslü parantezleri kaldır
      setWelcomeMessage(t('dashboard.welcomeMessage', { name: decodedName }).replace(/{|}/g, ''));
    } else {
      console.log("No user name available for welcome message");
      setWelcomeMessage(t('dashboard.welcomeGeneric'));
    }
  }, [user, t]);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const token = getToken();
      if (!token) {
        console.log("Redirecting to login: No authentication");
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Kullanıcı bilgilerini manuel olarak yenileme fonksiyonu
  const handleRefreshUserData = async () => {
    try {
      await fetchUserData();
      showToast(t('common.success'), t('dashboard.userDataRefreshed'), 'success');
      console.log("User data refreshed");
    } catch (error) {
      console.error("Error refreshing user data:", error);
      showToast(t('common.error'), t('dashboard.userDataRefreshError'), 'error');
    }
  };

  // Token bilgilerini görüntüleme
  const getTokenInfo = () => {
    const token = getToken();
    if (!token) return t('dashboard.noToken');
    
    try {
      return JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2);
    } catch (e) {
      return t('dashboard.tokenDecodeError');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="ml-4">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toast && toast.isVisible && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          toast.status === 'success' ? 'bg-green-100 border border-green-200' : 
          toast.status === 'error' ? 'bg-red-100 border border-red-200' : 
          'bg-blue-100 border border-blue-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {toast.status === 'success' && (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toast.status === 'error' && (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                toast.status === 'success' ? 'text-green-800' : 
                toast.status === 'error' ? 'text-red-800' : 
                'text-blue-800'
              }`}>
                {toast.title}
              </h3>
              <div className={`mt-1 text-sm ${
                toast.status === 'success' ? 'text-green-700' : 
                toast.status === 'error' ? 'text-red-700' : 
                'text-blue-700'
              }`}>
                {toast.description}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                  <p className="text-gray-600">{welcomeMessage}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.name || t('dashboard.user')}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-600">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {user?.name ? user.name.replace(/\+/g, ' ') : t('dashboard.anonymousUser')}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email || t('dashboard.noEmail')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={handleRefreshUserData}
                  className="flex items-center justify-center space-x-2"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  <span>{t('dashboard.refreshUserData')}</span>
                </Button>
                
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="flex items-center justify-center space-x-2"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </Button>
              </div>
            </div>
            
            {/* Debug bilgileri */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-sm font-semibold mb-2">{t('dashboard.debugInfo')}</h3>
              <div className="space-y-2 text-xs">
                <p className="mb-1">{t('dashboard.isAuthenticated')}: {isAuthenticated ? 'true' : 'false'}</p>
                <div className="p-2 bg-gray-100 rounded overflow-auto">
                  <p className="mb-1">{t('dashboard.userObject')}:</p>
                  <pre className="whitespace-pre-wrap break-all">
                    {user ? JSON.stringify(user, null, 2) : 'null'}
                  </pre>
                </div>
                <p className="mb-1">{t('dashboard.cookieToken')}: {Cookies.get('accessToken') ? t('dashboard.exists') : t('dashboard.notExists')}</p>
                <p className="mb-1">{t('dashboard.localStorageToken')}: {typeof window !== 'undefined' && localStorage.getItem('accessToken') ? t('dashboard.exists') : t('dashboard.notExists')}</p>
                <div className="mt-2">
                  <p className="text-xs font-semibold mb-1">{t('dashboard.tokenContent')}:</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40 whitespace-pre-wrap break-all">
                    {getTokenInfo()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


