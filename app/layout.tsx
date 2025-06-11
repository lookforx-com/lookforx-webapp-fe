import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LookforX',
  description: 'LookforX - Request products and services and make offers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16"> {/* Header'ın altında yer açmak için pt-16 ekledik */}
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}