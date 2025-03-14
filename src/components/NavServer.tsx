import { HomeIcon, ListBulletIcon } from "@heroicons/react/16/solid";

import { getSession } from "@/actions/auth";
import { NavClient } from "@/components/NavClient";

const navLinks = [
  {
    href: "/",
    label: (
      <span className="flex items-center gap-1">
        <HomeIcon className="size-4 text-blue-600/60 dark:text-blue-500/60" />
        Home
      </span>
    ),
  },
  {
    href: "/dashboard",
    label: (
      <span className="flex items-center gap-1">
        <ListBulletIcon className="size-4 text-blue-600/60 dark:text-blue-500/60" />
        My Lists
      </span>
    ),
  },
] as const;

export const NavServer = async () => {
  const session = await getSession();

  return (
    <header className="w-screen">
      <NavClient user={session?.user} navLinks={navLinks} />
    </header>
  );
};
