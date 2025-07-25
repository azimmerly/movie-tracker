import { TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { User } from "better-auth";
import { toast } from "sonner";

import { getUserMovieListIds } from "@/actions/list";
import { revalidatePaths } from "@/actions/utils";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Typography } from "@/components/ui/Typography";
import { authClient } from "@/lib/authClient";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: User["id"];
};

export const DeleteAccountDialog = ({
  open,
  onClose,
  userId,
}: DeleteAccountDialogProps) => {
  const handleDeleteAccount = async () => {
    onClose();
    const { data: userListIds, success } = await getUserMovieListIds(userId);

    const pathsToRevalidate = [
      "/",
      "/dashboard",
      "/account",
      `/user/${userId}`,
    ];

    if (success && userListIds?.length) {
      const listPaths = userListIds.map((id) => `/list/${id}`);
      pathsToRevalidate.push(...listPaths);
    }

    await authClient.deleteUser({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          toast.warning("Account deleted");
          await revalidatePaths(pathsToRevalidate);
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-gray-700">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-6 text-red-600 dark:text-red-500"
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Typography.H3>Delete account</Typography.H3>
          <Typography.Small className="mt-2" muted>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography.Small>
        </div>
      </div>
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
