import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/Toaster";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="system" enableSystem>
    <Toaster />
    {children}
  </ThemeProvider>
);
