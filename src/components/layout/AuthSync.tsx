"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { listenForSignOut } from "@/utils/authBroadcast";

export const AuthSync = () => {
  const router = useRouter();

  useEffect(() => {
    return listenForSignOut(() => router.refresh());
  }, [router]);

  return null;
};
