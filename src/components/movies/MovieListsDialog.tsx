"use client";

import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Typography } from "@/components/ui/Typography";
import type { MovieList } from "@/types";

type MovieListsDialogProps = {
  lists: Pick<MovieList, "id" | "title">[];
  movieTitle: string;
  overflowCount: number;
};

export const MovieListsDialog = ({
  lists,
  movieTitle,
  overflowCount,
}: MovieListsDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer hover:underline"
      >
        +{overflowCount} more
      </button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="mb-7 flex flex-col items-center gap-3 sm:flex-row">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 dark:bg-mist-800">
            <ListBulletIcon
              aria-hidden="true"
              className="size-5.5 text-blue-600 dark:text-blue-500"
            />
          </div>
          <div className="text-center sm:text-left">
            <Typography.H3>{movieTitle}</Typography.H3>
            <Typography.Tiny muted>
              Appears in the following lists
            </Typography.Tiny>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="divide-y divide-mist-200 dark:divide-mist-800">
            {lists.map(({ id, title }) => (
              <li key={id} className="py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={`/list/${id}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between text-sm hover:underline"
                >
                  <span className="truncate">{title}</span>
                  <ChevronRightIcon className="size-4.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {lists.length > 5 && (
          <div className="from-offwhite via-offwhite pointer-events-none absolute right-0 bottom-0 left-0 h-16 rounded-b-xl bg-linear-to-t to-transparent dark:from-mist-900 dark:via-mist-900" />
        )}
      </Dialog>
    </>
  );
};
