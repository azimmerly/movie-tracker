"use client";

import { ListBulletIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Session } from "better-auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { addMovieList } from "@/actions/list";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { Typography } from "@/components/ui/Typography";
import type { AddListData } from "@/types";
import { addListSchema } from "@/utils/validation/list";

type AddListDialogProps = {
  session?: Session;
};

export const AddListDialog = ({ session }: AddListDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, reset, handleSubmit, formState, control } =
    useForm<AddListData>({
      resolver: zodResolver(addListSchema),
      defaultValues: { private: false },
    });

  const handleAddList = async (formData: AddListData) => {
    const res = await addMovieList(formData);
    setIsDialogOpen(false);
    if (res.success) {
      toast.success("List created");
      redirect(`/list/${res.data?.id}`);
    } else {
      toast.error(res.message);
    }
  };

  const handleClick = () => {
    if (!session) {
      toast.info("Sign in to get started");
      redirect("/sign-in");
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        icon={PlusCircleIcon}
        className="w-full min-w-max sm:w-fit"
      >
        Create new list
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onTransitionEnd={() => reset()}
      >
        <div className="mb-3 flex flex-col items-center gap-3 sm:mb-5 sm:flex-row">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-gray-700">
            <ListBulletIcon
              aria-hidden="true"
              className="size-[22px] text-blue-600 dark:text-blue-500"
            />
          </div>
          <Typography.H3 className="text-center sm:text-left">
            Create a new movie list
          </Typography.H3>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleAddList)}
        >
          <InputField
            autoFocus
            id="list-title"
            type="text"
            label="List title"
            placeholder="Spooky horror movies"
            {...register("title")}
            errorMessage={formState.errors?.title?.message}
          />
          <Controller
            name="private"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Private (only visible to you)"
                checked={field.value}
                onChange={field.onChange}
                className="mt-0.5 font-medium text-gray-600 dark:text-gray-300"
              />
            )}
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-fit"
              icon={PlusCircleIcon}
              disabled={formState.isSubmitting || !formState.dirtyFields.title}
              busy={formState.isSubmitting}
            >
              Create
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-fit"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};
