import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Dimax Distribution - Premium B2B Produce',
  description: 'Supplying restaurants and businesses with the finest quality fresh vegetables and legumes from local farms.',
  keywords: ['vegetables', 'legumes', 'wholesale', 'B2B', 'restaurant supply', 'fresh produce'],
  authors: [{ name: 'Dimax Distribution' }],
  openGraph: {
    title: 'Dimax Distribution - Premium B2B Produce',
    description: 'Supplying restaurants and businesses with the finest quality fresh vegetables and legumes from local farms.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ro_RO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dimax Distribution - Premium B2B Produce',
    description: 'Supplying restaurants and businesses with the finest quality fresh vegetables and legumes from local farms.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
    languages: {
      'en': '/en',
      'ro': '/ro',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}




