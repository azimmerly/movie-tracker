"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateMovieList } from "@/actions/list";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { TextareaField } from "@/components/ui/TextareaField";
import type { MovieList, UpdateListData } from "@/types";
import { updateListSchema } from "@/utils/validation/list";

type UpdateListDialogProps = {
  list: Pick<MovieList, "id" | "title" | "description">;
  open: boolean;
  onClose: () => void;
};

export const UpdateListDialog = ({
  list,
  open,
  onClose,
}: UpdateListDialogProps) => {
  const router = useRouter();
  const { id, title, description } = list;
  const { register, reset, handleSubmit, formState } = useForm<UpdateListData>({
    defaultValues: { id, title, description: description ?? undefined },
    resolver: zodResolver(updateListSchema),
    mode: "onChange",
  });

  const handleUpdateList = async (formData: UpdateListData) => {
    if (!formState.isDirty) {
      return;
    }
    onClose();
    const res = await updateMovieList(formData);
    if (res.success) {
      toast.success("List updated");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnd={() => {
        reset({ id, title, description: description ?? undefined });
      }}
      header={{ icon: PencilSquareIcon, title: "Edit list" }}
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleUpdateList)}
      >
        <InputField
          autoFocus
          id="list-title"
          type="text"
          label="List title"
          {...register("title")}
          errorMessage={formState.errors?.title?.message}
        />
        <TextareaField
          id="list-description"
          label="Description"
          placeholder="Add an optional short description"
          {...register("description")}
          errorMessage={formState.errors?.description?.message}
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
