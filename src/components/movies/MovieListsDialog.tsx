"use client";

import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import type { MovieList } from "@/types";

type MovieListsDialogProps = {
  lists: Pick<MovieList, "id" | "title">[];
  movieTitle: string;
};

export const MovieListsDialog = ({
  lists,
  movieTitle,
}: MovieListsDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer hover:underline"
      >
        {lists.length} lists
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        header={{
          icon: ListBulletIcon,
          title: movieTitle,
          subtitle: `In ${lists.length} lists`,
        }}
      >
        <div className="-mx-2 mt-2 max-h-60 scrollbar-none overflow-y-auto px-2 pb-5">
          <ul className="flex flex-col gap-0.5">
            {lists.map(({ id, title }) => (
              <li key={id}>
                <Link
                  href={`/list/${id}`}
                  onClick={() => setOpen(false)}
                  className="group -mx-2 flex items-center justify-between gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-mist-100 dark:hover:bg-mist-800"
                >
                  <span className="truncate">{title}</span>
                  <ChevronRightIcon className="size-4.5 shrink-0 text-mist-400 group-hover:text-mist-600 dark:text-mist-500 dark:group-hover:text-mist-300" />
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
