"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { User } from "better-auth";
import { useState } from "react";

import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { UpdateAccountDialog } from "./UpdateAccountDialog";

type OptionsDropdownProps = {
  user: User;
};

export const OptionsDropdown = ({ user }: OptionsDropdownProps) => {
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
      <DropdownMenu
        buttonText="Options"
        options={menuOptions}
        ellipsisOnMobile
      />
      <UpdateAccountDialog
        user={user}
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      />
      <DeleteAccountDialog
        userId={user.id}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};
