import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from '@/components/layout/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AlgoSim — Master DSA with Real-World Simulations',
  description: 'Next-generation DSA learning platform. Practice algorithms with interactive simulations, real-world scenarios, and instant feedback.',
  keywords: ['DSA', 'algorithms', 'data structures', 'leetcode', 'coding interview', 'simulation'],
  openGraph: {
    title: 'AlgoSim',
    description: 'Master DSA with real-world simulations',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-950 text-dark-100 antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
