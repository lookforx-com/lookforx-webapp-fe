'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { LogoSmall } from '@/components/navigation/Logo';

export default function Footer() {
  const { t } = useLanguage();
  
  // Footer linkleri için çeviriler
  const footerLinks = [
    { 
      key: 'about', 
      href: '/about', 
      label: t('footer.about', 'About') 
    },
    { 
      key: 'contact', 
      href: '/contact', 
      label: t('footer.contact', 'Contact') 
    },
    { 
      key: 'privacy', 
      href: '/privacy', 
      label: t('footer.privacy', 'Privacy Policy') 
    },
    { 
      key: 'terms', 
      href: '/terms', 
      label: t('footer.terms', 'Terms of Service') 
    }
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <LogoSmall />
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">LookforX</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} LookforX. {t('footer.rights')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-8">
            {footerLinks.map(link => (
              <Link 
                key={link.key}
                href={link.href} 
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}