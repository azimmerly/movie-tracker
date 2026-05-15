"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { authClient } from "@/lib/authClient";
import { broadcastSignOut } from "@/utils/authBroadcast";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteAccountDialog = ({
  open,
  onClose,
}: DeleteAccountDialogProps) => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    onClose();
    await authClient.deleteUser({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onSuccess: () => {
          toast.warning("Account deleted");
          broadcastSignOut();
          router.refresh();
        },
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      header={{
        icon: ExclamationTriangleIcon,
        variant: "destructive",
        title: "Delete account",
        subtitle:
          "Are you sure you want to delete your account? This action cannot be undone.",
      }}
    >
      <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          variant="destructive"
          className="w-full sm:w-fit"
          icon={TrashIcon}
          onClick={handleDeleteAccount}
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
