
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiMail, FiLock, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import api from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();
  const { getGoogleAuthUrl, fetchUserData } = useAuth();
  const { t } = useLanguage();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Şifre doğrulama
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Şifre değiştiğinde doğrulama
  useEffect(() => {
    setPasswordValid({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  // Form gönderme işlevi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // API'ye kayıt isteği gönder
      await api.post('/auth/register', {
        name,
        email,
        password
      });
      
      // Başarılı kayıttan sonra giriş sayfasına yönlendir
      router.push('/login?success=Account created successfully! Please log in.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google ile kayıt
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Google signup failed');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-24">
      {/* Sol taraf - Marka */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 text-gray-900 flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold mb-4">lookforx.com</h1>
        <p className="text-lg mb-6 text-gray-800">
          {t('branding.signupDescription')}
        </p>
      </div>

      {/* Sağ taraf - Kayıt Formu */}
      <div className="flex flex-1 items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-primary-600">
              <h2 className="text-xl font-semibold text-center text-gray-900">{t('common.createAccount')}</h2>
              <p className="text-center text-gray-800 mt-1 text-sm">
                {t('signup.subtitle')}
              </p>
              
              {/* Hata mesajı */}
              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.fullName')}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('common.fullNamePlaceholder')}
                      required
                      autoComplete="new-name"
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.email')}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('common.emailPlaceholder')}
                      required
                      autoComplete="new-email"
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.password')}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('common.passwordPlaceholder')}
                      required
                      autoComplete="new-password"
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                {/* Password requirements */}
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-xs">
                  <p className="font-medium mb-2 text-gray-700">{t('signup.passwordRequirements')}</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${passwordValid.length ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid.length ? (
                        <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FiX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {t('signup.minLength')}
                    </li>
                    <li className={`flex items-center ${passwordValid.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid.uppercase ? (
                        <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FiX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {t('signup.uppercase')}
                    </li>
                    <li className={`flex items-center ${passwordValid.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid.lowercase ? (
                        <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FiX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {t('signup.lowercase')}
                    </li>
                    <li className={`flex items-center ${passwordValid.number ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid.number ? (
                        <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FiX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {t('signup.number')}
                    </li>
                    <li className={`flex items-center ${passwordValid.special ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid.special ? (
                        <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FiX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {t('signup.specialChar')}
                    </li>
                  </ul>
                </div>
                
                <Button 
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  {t('common.createAccount')}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t('common.or')} {t('common.continueWith')}
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                className="w-full flex items-center justify-center"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                <span>Google</span>
              </Button>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                {t('common.alreadyHaveAccount')}{' '}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('common.signIn')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
