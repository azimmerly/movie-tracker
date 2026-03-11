"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export const Toaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      richColors
      position="bottom-left"
      theme={resolvedTheme as ToasterProps["theme"]}
    />
  );
};
