import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { revalidatePaths } from "@/actions/utils";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { DialogHeader } from "@/components/ui/DialogHeader";
import { authClient } from "@/lib/authClient";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteAccountDialog = ({
  open,
  onClose,
}: DeleteAccountDialogProps) => {
  const handleDeleteAccount = async () => {
    onClose();
    await authClient.deleteUser({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          toast.warning("Account deleted");
          await revalidatePaths(["/account"]);
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        icon={ExclamationTriangleIcon}
        title="Delete account"
        variant="destructive"
        subtitle="Are you sure you want to delete your account? This action cannot be undone."
      />
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
