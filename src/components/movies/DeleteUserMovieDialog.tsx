"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteUserMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
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
  const router = useRouter();

  const handleDelete = async () => {
    onClose();
    const res = await deleteUserMovie({ movieId });
    if (res.success) {
      toast.success("Movie removed");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      header={{
        icon: ExclamationTriangleIcon,
        variant: "destructive",
        title: "Remove movie",
        subtitle: `Are you sure you want to remove this movie?${listCount > 0 ? ` This will also remove it from ${listCount} ${listCount === 1 ? "list" : "lists"}.` : ""}`,
      }}
    >
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
