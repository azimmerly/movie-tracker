"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { UpdateAccountDialog } from "./UpdateAccountDialog";

type OptionsDropdownProps = {
  username: string;
};

export const OptionsDropdown = ({ username }: OptionsDropdownProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const menuOptions = [
    {
      label: "Update account",
      icon: PencilSquareIcon,
      onClick: () => setIsUpdateDialogOpen(true),
    },
    {
      label: "Delete account",
      icon: TrashIcon,
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ] as const;

  return (
    <>
      <DropdownMenu text="Options" options={menuOptions} />
      <UpdateAccountDialog
        username={username}
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      />
      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};
