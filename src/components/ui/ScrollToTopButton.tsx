"use client";

import { Button } from "@headlessui/react";
import { ArrowUpIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={twMerge(
        "fixed right-6 bottom-6 z-50 flex size-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg transition-opacity duration-250 hover:brightness-110",
        visible
          ? "cursor-pointer opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUpIcon className="size-5" aria-hidden="true" />
    </Button>
  );
};
