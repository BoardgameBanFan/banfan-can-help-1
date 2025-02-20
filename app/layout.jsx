import { Geist, Geist_Mono } from 'next/font/google';
import { SWRProvider } from '@/lib/swr-config';
import BottomNavigation from '@/components/BottomNavigation';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 min-h-screen px-4`}>
        123333
        <SWRProvider>
          <div className="relative mx-auto max-w-[480px] min-h-screen bg-white shadow-lg shadow-gray-200/80">
            <div className="pb-16">{children}</div>
            <BottomNavigation />
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}
