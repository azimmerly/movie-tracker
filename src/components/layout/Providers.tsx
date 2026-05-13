import { ThemeProvider } from "next-themes";

import { AuthSync } from "@/components/layout/AuthSync";
import { Toaster } from "@/components/layout/Toaster";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="system" enableSystem>
    <AuthSync />
    <Toaster />
    {children}
  </ThemeProvider>
);
