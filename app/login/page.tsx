'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, getGoogleAuthUrl } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hata mesajını kontrol et
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Form gönderme işlevi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Google ile giriş
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || t('login.googleLoginFailed'));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-24">
      {/* Sol taraf - Marka */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{t('branding.title')}</h1>
        <p className="text-lg mb-6 text-gray-800">
          {t('branding.loginDescription')}
        </p>
      </div>

      {/* Sağ taraf - Giriş Formu */}
      <div className="flex flex-1 items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-primary-600">
              <h2 className="text-xl font-semibold text-center text-gray-900">{t('login.title')}</h2>
              <p className="text-center text-gray-800 mt-1 text-sm">
                {t('login.subtitle')}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('common.emailPlaceholder')}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{t('common.password')}</Label>
                    <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-500">
                      {t('common.forgotPassword')}
                    </Link>
                  </div>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('common.passwordPlaceholder')}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {t('common.signIn')}
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
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Google</span>
              </Button>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                {t('login.noAccount')}{' '}
                <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('login.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}