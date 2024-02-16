"use client";

import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa6";

const providers = [
  { name: "Google", icon: <FaGoogle className="h-4 w-4" /> },
  { name: "GitHub", icon: <FaGithub className="h-4 w-4" /> },
] as const;

export const ProviderAuthButtons = () => (
  <div className="w-full">
    <div className="relative flex w-full flex-col items-center justify-center">
      <hr className="my-8 h-px w-full bg-slate-500" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-sm font-medium text-slate-500">
        or
      </span>
    </div>
    <div className="flex flex-col gap-2">
      {providers.map(({ name, icon }) => (
        <button
          key={name}
          onClick={() => signIn(name.toLowerCase())}
          className="flex w-full items-center justify-center gap-2 self-center rounded-full border border-slate-500 bg-white px-5 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
        >
          {icon}
          Continue with {name}
        </button>
      ))}
    </div>
  </div>
);
