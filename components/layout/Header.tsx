'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { Button } from '@/components/ui/button/Button';
import { LogoSmall } from '@/components/navigation/Logo';

export default function Header() {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Login ve signup sayfalarında olup olmadığımızı kontrol et
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <LogoSmall />
          <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">LookforX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                {t('common.dashboard')}
              </Link>
              <Link href="/profile" className="text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                {t('common.profile')}
              </Link>
              <Link href="/settings" className="text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                {t('common.settings')}
              </Link>
              <Button 
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-sm font-medium px-3 py-2 rounded text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
              >
                {t('common.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => router.push('/login')}
                className={`text-gray-800 dark:text-white ${pathname === '/login' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                {t('common.login')}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => router.push('/signup')}
                className={`text-gray-800 dark:text-white ${pathname === '/signup' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                {t('common.signup')}
              </Button>
            </>
          )}
          
          {/* Dil değiştirici */}
          <div className="border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 py-4 shadow-md">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      {t('common.dashboard')}
                    </div>
                  </Link>
                  <Link 
                    href="/profile" 
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      {t('common.profile')}
                    </div>
                  </Link>
                  <Link 
                    href="/settings" 
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FaCog className="mr-2" />
                      {t('common.settings')}
                    </div>
                  </Link>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <FaSignOutAlt className="mr-2" />
                      {t('common.logout')}
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push('/login');
                      setIsMenuOpen(false);
                    }}
                    className="mx-4 mb-2"
                  >
                    {t('common.login')}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="mx-4"
                  >
                    {t('common.signup')}
                  </Button>
                </>
              )}
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <div className="px-4 py-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
