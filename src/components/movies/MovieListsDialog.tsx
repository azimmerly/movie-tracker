"use client";

import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        header={{
          icon: ListBulletIcon,
          title: movieTitle,
          subtitle: "Found in the following lists",
        }}
      >
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
        {lists.length > 5 && <div className="scroll-fade" />}
      </Dialog>
    </>
  );
};
