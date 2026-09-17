import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './cni-styles.css';
import { AppStoreProvider } from '@/lib/store';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Postly',
  description:
    'Crescent Nova International — Enterprise Social Media Publishing, Calendar Scheduling, Multi-Platform Approval Queues, and Leads CRM Management.',
  icons: {
    icon: '/logo2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-gray-900 antialiased min-h-screen">
        <AppStoreProvider>
          {children}
        </AppStoreProvider>
      </body>
    </html>
  );
}
