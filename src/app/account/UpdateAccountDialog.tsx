"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { authClient } from "@/lib/authClient";
import type { UpdateUserData } from "@/types";
import { updateUserSchema } from "@/utils/validation/user";

type UpdateAccountDialogProps = {
  username: string;
  open: boolean;
  onClose: () => void;
};

export const UpdateAccountDialog = ({
  open,
  onClose,
  username,
}: UpdateAccountDialogProps) => {
  const router = useRouter();
  const { register, reset, handleSubmit, formState } = useForm<UpdateUserData>({
    defaultValues: { name: username },
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
  });

  const handleUpdateAccount = async (formData: UpdateUserData) => {
    if (!formState.isDirty) {
      return;
    }

    await authClient.updateUser(
      { name: formData.name },
      {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onSuccess: () => {
          toast.success("Updated name");
        },
      },
    );

    onClose();
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnd={() => reset({ name: username })}
      header={{ icon: PencilSquareIcon, title: "Update account" }}
    >
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
        <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-fit"
            icon={CheckCircleIcon}
            disabled={
              formState.isSubmitting || !formState.isDirty || !formState.isValid
            }
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
