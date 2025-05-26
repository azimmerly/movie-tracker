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
  id: MovieList["id"];
  title: MovieList["title"];
  isPrivate: MovieList["private"];
};

export const ListOptions = ({ id, title, isPrivate }: ListOptionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const menuOptions = [
    {
      label: "Update title",
      icon: PencilSquareIcon,
      onClick: () => setIsUpdateDialogOpen(true),
    },
    {
      label: isPrivate ? "Make public" : "Make private",
      icon: isPrivate ? EyeIcon : EyeSlashIcon,
      onClick: async () => {
        const res = await updateMovieList({
          id,
          private: !isPrivate,
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
        id={id}
        title={title}
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      />
      <DeleteListDialog
        id={id}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
