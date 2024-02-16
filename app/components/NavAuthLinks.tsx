"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircleUser, FaDoorOpen } from "react-icons/fa6";

import { ToolTip } from ".";

type NavAuthLinksProps = {
  user: Session["user"] | null;
};

export const NavAuthLinks = ({ user }: NavAuthLinksProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const clearCacheAndSignOut = () => {
    queryClient.cancelQueries();
    queryClient.clear();
    signOut();
  };

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:opacity-90"
      >
        <FaCircleUser className="h-4 w-4" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {pathname !== "/" && (
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:opacity-90"
        >
          My Lists
        </Link>
      )}
      <button
        onClick={clearCacheAndSignOut}
        className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:opacity-90"
      >
        <FaDoorOpen className="h-4 w-4" />
        Sign out
      </button>
      <ToolTip tooltip={user.email ?? "Account"}>
        <Link href="/account">
          {user.image ? (
            <Image
              priority
              src={user.image}
              alt="user profile"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full bg-indigo-600"
            />
          ) : (
            <FaCircleUser className="h-8 w-8 text-white" />
          )}
        </Link>
      </ToolTip>
    </div>
  );
};
