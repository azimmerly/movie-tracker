import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster, type DefaultToastOptions } from "react-hot-toast";

import { Footer, Nav, QueryWrapper } from "@/app/components";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Tracker",
  description: "Create lists of your favorite movies",
  icons: {
    icon: "./favicon.ico",
  },
};

const toastOptions: DefaultToastOptions = {
  success: {
    duration: 4000,
    iconTheme: {
      primary: "#4f46e5",
      secondary: "#fff",
    },
  },
  error: {
    duration: 4000,
    iconTheme: {
      primary: "#f87171",
      secondary: "#fff",
    },
  },
} as const;

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body className={inter.className}>
      <QueryWrapper>
        <Toaster position="bottom-left" toastOptions={toastOptions} />
        <div className="flex min-h-screen flex-col items-center bg-slate-100">
          <Nav />
          <main className="flex w-full max-w-5xl flex-auto flex-col px-4 sm:px-4">
            {children}
          </main>
          <Footer />
        </div>
      </QueryWrapper>
    </body>
  </html>
);

export default RootLayout;
