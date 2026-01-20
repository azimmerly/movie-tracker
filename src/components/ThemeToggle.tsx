"use client";

import { Switch } from "@headlessui/react";
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
    return <div className="h-6 w-11" />;
  }

  return (
    <Switch
      className={twMerge(
        "group inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200/70 transition-colors ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden data-checked:bg-blue-600",
        className,
      )}
      onChange={toggleTheme}
      checked={resolvedTheme === "dark"}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition ease-in-out group-data-checked:translate-x-5 dark:bg-gray-700">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ease-in group-data-checked:opacity-0 group-data-checked:ease-out"
        >
          <SunIcon className="size-3.5 text-gray-500" />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity ease-out group-data-checked:opacity-100 group-data-checked:ease-in"
        >
          <MoonIcon className="size-3.5 text-white" />
        </span>
      </span>
    </Switch>
  );
};
