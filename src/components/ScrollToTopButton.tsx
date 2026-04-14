"use client";

import { ArrowUpIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/Button";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      size="circle"
      variant="secondary"
      aria-label="Scroll to top"
      icon={ArrowUpIcon}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={twMerge(
        "fixed right-6 bottom-6 z-50 shadow-lg transition-opacity duration-250",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />
  );
};
