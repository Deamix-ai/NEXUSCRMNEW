import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | CRM Nexus - Bowmans Kitchens & Bathrooms',
    default: 'CRM Nexus - Bowmans Kitchens & Bathrooms',
  },
  description: 'Production-ready CRM for bathroom industry professionals',
  keywords: ['CRM', 'bathroom', 'kitchen', 'project management', 'field operations'],
  authors: [{ name: 'Bowman Bathrooms Ltd' }],
  creator: 'Bowman Bathrooms Ltd',
  publisher: 'Bowman Bathrooms Ltd',
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'CRM Nexus',
    title: 'CRM Nexus - Bowmans Kitchens & Bathrooms',
    description: 'Production-ready CRM for bathroom industry professionals',
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
