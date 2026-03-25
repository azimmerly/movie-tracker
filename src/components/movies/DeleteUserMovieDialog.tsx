"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { deleteUserMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Typography } from "@/components/ui/Typography";
import type { Movie } from "@/types";

type DeleteMovieDialogProps = {
  open: boolean;
  onClose: () => void;
  movieId: Movie["id"];
  listCount: number;
};

export const DeleteUserMovieDialog = ({
  open,
  onClose,
  movieId,
  listCount,
}: DeleteMovieDialogProps) => {
  const handleDelete = async () => {
    onClose();
    const res = await deleteUserMovie({ movieId });
    if (res.success) {
      toast.success("Movie removed");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-mist-800">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-6 text-red-600 dark:text-red-500"
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Typography.H3>Remove movie</Typography.H3>
          <Typography.Small className="mt-2" muted>
            Are you sure you want to remove this movie?
            {listCount > 0 && (
              <>
                {" "}
                This will also remove it from {listCount}{" "}
                {listCount === 1 ? "list" : "lists"}.
              </>
            )}
          </Typography.Small>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          variant="destructive"
          className="w-full sm:w-fit"
          icon={TrashIcon}
          onClick={handleDelete}
        >
          Remove
        </Button>
        <Button
          variant="secondary"
          className="w-full sm:w-fit"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};
