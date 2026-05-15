"use client";

import {
  ChartBarIcon,
  FilmIcon,
  ListBulletIcon,
} from "@heroicons/react/16/solid";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

type DashboardTabsProps = {
  basePath: string;
};

const TABS = [
  { segment: "lists", icon: ListBulletIcon },
  { segment: "movies", icon: FilmIcon },
  { segment: "stats", icon: ChartBarIcon },
] as const;

export const DashboardTabs = ({ basePath }: DashboardTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="flex scrollbar-none gap-1 overflow-x-auto">
      {TABS.map(({ segment, icon: Icon }) => {
        const href = `${basePath}/${segment}`;
        const active = pathname === href;
        return (
          <Link
            key={segment}
            href={href as Route}
            aria-current={active ? "page" : undefined}
            className={twMerge(
              "flex items-center gap-1 rounded-md px-3 py-1.25 font-semibold capitalize hover:bg-mist-200/60 sm:px-3.25 sm:py-1.5 dark:hover:bg-mist-800/70",
              active &&
                "pointer-events-none bg-mist-200/60 dark:bg-mist-800/70",
            )}
          >
            <Icon className="size-4 text-blue-600/70 dark:text-blue-500/70" />
            {segment}
          </Link>
        );
      })}
    </div>
  );
};
