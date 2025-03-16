import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SWRProvider } from "@/lib/swr-config";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Banfan Meetup",
  description: "Banfan Meetup",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-[#F5F5F5]`}>
        <SWRProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="relative mx-auto max-w-[480px] min-h-screen bg-[#F5F5F5] shadow-lg shadow-gray-200/80">
              {children}
            </div>
          </NextIntlClientProvider>
          <Toaster />
        </SWRProvider>
      </body>
    </html>
  );
}
