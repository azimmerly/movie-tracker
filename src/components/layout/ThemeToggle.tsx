"use client";

import { Button } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { twMerge, type ClassNameValue } from "tailwind-merge";

import { useIsMounted } from "@/utils/useIsMounted";

export const ThemeToggle = ({ className }: { className?: ClassNameValue }) => {
  const isMounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!isMounted || !resolvedTheme) {
    return <div className="size-8" />;
  }

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      className={twMerge(
        "flex size-8 cursor-pointer items-center justify-center rounded-full text-mist-400 transition-colors hover:bg-mist-200/60 hover:text-mist-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-mist-800/70 dark:hover:text-mist-300",
        className,
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        key={resolvedTheme}
        aria-hidden="true"
        className="animate-spin-in block"
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="size-5" />
        ) : (
          <MoonIcon className="size-5" />
        )}
      </span>
    </Button>
  );
};
