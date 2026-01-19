import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { NavServer } from "@/components/NavServer";
import { Providers } from "@/components/Providers";
import { APP_NAME } from "@/consts";
import { interFont } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Track your favorite movies",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={interFont.className} suppressHydrationWarning>
    <head>
      <title>{APP_NAME}</title>
    </head>
    <body className="bg-offwhite text-gray-900 dark:bg-gray-900/70 dark:text-white">
      <div className="flex min-h-screen flex-col items-center antialiased">
        <Providers>
          <NavServer />
          <main className="flex w-screen max-w-6xl grow flex-col px-4 py-8 sm:px-6 sm:py-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </div>
    </body>
  </html>
);

export default RootLayout;
