import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SplitLease — Smart Roommate & Apartment Finder',
  description:
    "Don't just find an apartment. Find the right person to share it with. Combined roommate compatibility, apartment discovery, and group matching.",
  openGraph: {
    title: 'SplitLease — Smart Roommate & Apartment Finder',
    description: 'Find compatible roommates and split lease on dream apartments together.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
