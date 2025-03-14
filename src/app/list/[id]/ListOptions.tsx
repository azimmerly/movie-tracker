"use client";

import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";

import { updateMovieList } from "@/actions/list";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { MovieList } from "@/types";
import { DeleteListDialog } from "./DeleteListDialog";
import { UpdateListDialog } from "./UpdateListDialog";

type ListOptionsProps = {
  listId: MovieList["id"];
  listTitle: MovieList["title"];
  listPrivate: MovieList["private"];
};

export const ListOptions = ({
  listId,
  listTitle,
  listPrivate,
}: ListOptionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const menuOptions = [
    {
      label: "Update title",
      icon: PencilSquareIcon,
      onClick: () => setIsUpdateDialogOpen(true),
    },
    {
      label: listPrivate ? "Make public" : "Make private",
      icon: listPrivate ? EyeIcon : EyeSlashIcon,
      onClick: async () => {
        const res = await updateMovieList({
          id: listId,
          private: !listPrivate,
        });
        if (res.success) {
          toast.success("List visibility updated");
        } else {
          toast.error(res.message);
        }
      },
    },
    {
      label: "Delete list",
      icon: TrashIcon,
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ] as const;

  return (
    <div className="pl-6">
      <DropdownMenu
        buttonText="List options"
        options={menuOptions}
        ellipsisOnMobile
      />
      <UpdateListDialog
        id={listId}
        title={listTitle}
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      />
      <DeleteListDialog
        id={listId}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
