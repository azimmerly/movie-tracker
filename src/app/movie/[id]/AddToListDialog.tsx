"use client";

import {
  CheckCircleIcon,
  ListBulletIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { addMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Dialog } from "@/components/ui/Dialog";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList } from "@/types";

type AddToListDialogProps = {
  movie: Pick<Movie, "id" | "title">;
  lists: (Pick<MovieList, "id" | "title"> & { added: boolean })[];
};

export const AddToListDialog = ({ movie, lists }: AddToListDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<MovieList["id"]>>(
    () => new Set(lists.filter(({ added }) => added).map(({ id }) => id)),
  );

  const handleAddToList = async (listId: MovieList["id"]) => {
    setAddedIds((prev) => new Set(prev).add(listId));
    const res = await addMovie({ listId, movieId: movie.id });
    if (res.success) {
      toast.success("Movie added");
      router.refresh();
    } else {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(listId);
        return next;
      });
      toast.error(res.message);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="w-full"
        icon={ListBulletIcon}
        onClick={() => setOpen(true)}
      >
        Add to list
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        header={{
          icon: ListBulletIcon,
          title: movie.title,
          subtitle: "Add to your lists",
        }}
      >
        {!lists.length ? (
          <Typography.Small muted className="block pb-5 text-center">
            You don&apos;t have any lists yet.
          </Typography.Small>
        ) : (
          <>
            <div className="-mx-2 mt-2 max-h-60 scrollbar-none overflow-y-auto px-2 pb-5">
              <ul className="flex flex-col gap-0.5">
                {lists.map(({ id, title }) => {
                  const isAdded = addedIds.has(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddToList(id)}
                        className={twMerge(
                          "group -mx-2 flex h-10 w-full items-center justify-between gap-2 rounded-md px-2 text-sm",
                          isAdded
                            ? "cursor-default"
                            : "cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-800",
                        )}
                      >
                        <span className="truncate">{title}</span>
                        {isAdded ? (
                          <Chip
                            variant="success"
                            icon={CheckCircleIcon}
                            text="Added"
                            className="shrink-0"
                          />
                        ) : (
                          <PlusCircleIcon className="size-4.5 shrink-0 text-mist-400 group-hover:text-blue-600 dark:text-mist-500 dark:group-hover:text-blue-500" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {lists.length > 5 && <div className="scroll-fade" />}
          </>
        )}
      </Dialog>
    </>
  );
};
