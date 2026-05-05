import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import logoImage from "@/assets/logo.png";
import { Typography } from "@/components/ui/Typography";
import { APP_NAME } from "@/consts";
import { pacificoFont } from "@/fonts";

type NavLogoProps = {
  className?: string;
  onClick?: () => void;
};

export const NavLogo = ({ className, onClick }: NavLogoProps) => (
  <Link
    href="/"
    onClick={onClick}
    className={twMerge(
      "-m-1 flex items-center gap-1.5 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden",
      className,
    )}
  >
    <Image
      priority
      draggable={false}
      src={logoImage}
      alt="logo"
      className="size-6.5 sm:size-7"
    />
    <Typography.Large
      className={twMerge(
        "text-xl font-bold tracking-tight sm:text-2xl",
        pacificoFont.className,
      )}
    >
      {APP_NAME}
    </Typography.Large>
  </Link>
);
