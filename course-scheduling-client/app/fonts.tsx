import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const titlingGothicFB = localFont({
  src: './fonts/TitlingGothicFB.woff2',
  display: 'swap',
});

export const inter = Inter({ subsets: ['latin'] });
