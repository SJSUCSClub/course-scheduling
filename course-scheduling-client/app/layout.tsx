import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/organisms';
import { cookies } from 'next/headers';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { inter } from './fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | Lenses',
    default: 'Lenses',
  },
  description: 'Find the best professors and courses at SJSU.',
  authors: [
    {
      name: 'Christopher Eliot Hall',
      url: 'https://chrehall68-github-io.vercel.app/',
    },
    { name: 'Agamjot Singh', url: 'https://github.com/agamjots05' },
    { name: 'Ejiro Igun', url: 'https://ejiros-website.vercel.app/' },
    { name: 'Justin Lee', url: 'http://justin-lee.me/' },
    { name: 'Manas Chougule', url: 'https://github.com/ManasC478' },
    { name: 'Ali Fayed', url: 'https://github.com/alifayed02' },
    { name: 'Kiet Quan', url: 'https://github.com/ducvub10' },
    { name: 'Karthik Manishankar', url: 'https://github.com/Kardee12' },
    { name: 'Trique Nguyen', url: 'https://triquenguyen.me/' },
    { name: 'Ahmad Gazali', url: 'https://www.gaza.li' },
  ],
  creator: 'ACM@SJSU',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: new URL('/', process.env.NEXT_PUBLIC_BASE_URL || ''),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = cookies().get('theme')?.value ?? '';
  return (
    <html lang="en" className={theme}>
      <body className={`${inter.className} bg-page text-text antialiased`}>
        {children}
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? ''} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
    </html>
  );
}
