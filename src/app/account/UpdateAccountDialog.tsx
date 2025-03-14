import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { Typography } from "@/components/ui/Typography";
import { authClient } from "@/lib/authClient";
import type { UpdateUserData } from "@/types";
import { updateUserSchema } from "@/utils/validation/user";

type UpdateAccountDialogProps = {
  user: User;
  open: boolean;
  onClose: () => void;
};

export const UpdateAccountDialog = ({
  open,
  onClose,
  user: { name, email, emailVerified },
}: UpdateAccountDialogProps) => {
  const router = useRouter();
  const { register, reset, handleSubmit, formState } = useForm<UpdateUserData>({
    defaultValues: { name, email },
    resolver: zodResolver(updateUserSchema),
  });

  const handleUpdateAccount = async (formData: UpdateUserData) => {
    if (!formState.isDirty) {
      return;
    }

    const updatePromises: Promise<unknown>[] = [];
    if (formState.dirtyFields.name) {
      updatePromises.push(
        authClient.updateUser(
          { name: formData.name },
          {
            onError: ({ error }) => {
              toast.error(error.message);
            },
            onSuccess: () => {
              toast.success("Updated name");
            },
          },
        ),
      );
    }
    if (!emailVerified && formState.dirtyFields.email) {
      updatePromises.push(
        authClient.changeEmail(
          { newEmail: formData.email },
          {
            onError: ({ error }) => {
              toast.error(error.message);
            },
            onSuccess: () => {
              toast.success("Updated email");
            },
          },
        ),
      );
    }

    onClose();
    await Promise.all(updatePromises);
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnd={() => reset({ name, email })}
    >
      <div className="mb-3 flex flex-col items-center gap-3 sm:mb-5 sm:flex-row">
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-gray-700">
          <PencilSquareIcon
            aria-hidden="true"
            className="size-[22px] text-blue-600 dark:text-blue-500"
          />
        </div>
        <Typography.H3 className="text-center sm:text-left">
          Update account
        </Typography.H3>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleUpdateAccount)}
      >
        <InputField
          autoFocus
          id="name"
          type="text"
          label="Name"
          {...register("name")}
          errorMessage={formState.errors?.name?.message}
        />
        {!emailVerified && (
          <InputField
            autoFocus
            id="email"
            type="text"
            label="Email"
            {...register("email")}
            errorMessage={formState.errors?.email?.message}
          />
        )}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-fit"
            icon={CheckCircleIcon}
            disabled={formState.isSubmitting || !formState.isDirty}
            busy={formState.isSubmitting}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-fit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
