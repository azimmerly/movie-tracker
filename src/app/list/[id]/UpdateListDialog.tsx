import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateMovieList } from "@/actions/list";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { Typography } from "@/components/ui/Typography";
import type { MovieList, UpdateListData } from "@/types";
import { updateListSchema } from "@/utils/validation/list";

type UpdateListDialogProps = {
  open: boolean;
  onClose: () => void;
} & Pick<MovieList, "id" | "title">;

export const UpdateListDialog = ({
  id,
  title,
  open,
  onClose,
}: UpdateListDialogProps) => {
  const { register, reset, handleSubmit, formState } = useForm<UpdateListData>({
    defaultValues: { id, title },
    resolver: zodResolver(updateListSchema),
  });

  const handleUpdateList = async (formData: UpdateListData) => {
    if (!formState.isDirty) {
      return;
    }
    onClose();
    const res = await updateMovieList(formData);
    if (res.success) {
      toast.success("List title updated");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnd={() => reset({ id, title })}
    >
      <div className="mb-3 flex flex-col items-center gap-3 sm:mb-5 sm:flex-row">
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-gray-700">
          <PencilSquareIcon
            aria-hidden="true"
            className="size-5.5 text-blue-600 dark:text-blue-500"
          />
        </div>
        <Typography.H3 className="text-center sm:text-left">
          Update list title
        </Typography.H3>
      </div>
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
