"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { listenForAuthChange } from "@/utils/authBroadcast";

export const AuthSync = () => {
  const router = useRouter();
  useEffect(() => listenForAuthChange(router.refresh), [router]);
  return null;
};
