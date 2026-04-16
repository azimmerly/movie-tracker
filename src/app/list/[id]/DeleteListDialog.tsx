"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteMovieList } from "@/actions/list";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { DialogHeader } from "@/components/ui/DialogHeader";
import type { MovieList } from "@/types";

type DeleteListDialogProps = {
  open: boolean;
  onClose: () => void;
} & Pick<MovieList, "id">;

export const DeleteListDialog = ({
  id,
  open,
  onClose,
}: DeleteListDialogProps) => {
  const router = useRouter();

  const handleDeleteList = async () => {
    onClose();
    const res = await deleteMovieList(id);
    if (res.success) {
      toast.success("List deleted");
      router.push("/dashboard/lists");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        icon={ExclamationTriangleIcon}
        title="Delete movie list"
        variant="destructive"
        subtitle="Are you sure you want to delete this movie list? This action cannot be undone."
      />
      <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          variant="destructive"
          className="w-full sm:w-fit"
          icon={TrashIcon}
          onClick={handleDeleteList}
        >
          Delete
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
