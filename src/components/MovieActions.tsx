"use client";

import { Checkbox, Field, Fieldset, Label } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Watch } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { updateMovie } from "@/actions/movie";
import { Tooltip } from "@/components/ui/Tooltip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, UpdateMovieData, UserMovie } from "@/types";
import { updateMovieSchema } from "@/utils/validation/movie";

type MovieActionsProps = {
  owner: boolean;
  movieId: Movie["id"];
  rating: UserMovie["rating"];
  favorite: UserMovie["favorite"];
};

export const MovieActions = ({
  owner,
  movieId,
  rating,
  favorite,
}: MovieActionsProps) => {
  const { control, formState, setValue, getValues } = useForm<UpdateMovieData>({
    defaultValues: { favorite, rating, movieId },
    resolver: zodResolver(updateMovieSchema),
  });

  const handleUpdate = async (
    field: "rating" | "favorite",
    value: UserMovie["rating"] | UserMovie["favorite"],
  ) => {
    if (!owner || formState.isSubmitting) {
      return;
    }

    const prevValue = getValues(field);
    setValue(field, value, { shouldDirty: true, shouldValidate: false });

    const revertUpdate = () => {
      setValue(field, prevValue, { shouldDirty: false, shouldValidate: false });
    };

    try {
      const res = await updateMovie(getValues());
      if (!res.success) {
        revertUpdate();
        toast.error(res.message);
      }
    } catch {
      revertUpdate();
      toast.error("Something went wrong");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const fullValue = (index + 1) * 2;
      const halfValue = fullValue - 1;
      const isFull = rating >= fullValue;
      const isHalf = !isFull && rating >= halfValue;

      return (
        <span key={index} className="relative -mx-px size-5.25">
          <StarIcon className="size-5.25 fill-mist-200 dark:fill-mist-700/70" />
          {(isFull || isHalf) && (
            <StarIcon
              className={twMerge(
                "absolute inset-0 size-5.25 fill-amber-400 dark:fill-amber-500",
                isHalf && "[clip-path:inset(0_50%_0_0)]",
              )}
            />
          )}
          {owner && (
            <>
              <span
                role="button"
                className="absolute top-0 left-0 h-full w-1/2 cursor-pointer"
                onClick={() =>
                  handleUpdate("rating", rating === halfValue ? 0 : halfValue)
                }
              />
              <span
                role="button"
                className="absolute top-0 right-0 h-full w-1/2 cursor-pointer"
                onClick={() =>
                  handleUpdate("rating", rating === fullValue ? 0 : fullValue)
                }
              />
            </>
          )}
        </span>
      );
    });
  };

  const renderCheckbox = (favorite: boolean) => (
    <Checkbox
      tabIndex={-1}
      checked={favorite}
      onChange={owner ? (e) => handleUpdate("favorite", e) : undefined}
      className={twMerge(
        "flex items-center gap-1",
        owner ? "cursor-pointer" : "cursor-default",
      )}
    >
      <HeartIcon
        strokeWidth={2}
        className={twMerge(
          "size-4.75 text-rose-400 dark:text-rose-500",
          favorite && "fill-rose-400 dark:fill-rose-500",
        )}
      />
      <Label as={Typography.Tiny} muted>
        Favorite
      </Label>
    </Checkbox>
  );

  const fieldset = (
    <Fieldset className="mt-2.25 flex flex-col gap-1.25">
      <Field className="flex">
        <Watch name={"rating"} control={control} render={renderStars} />
      </Field>
      <Field className="w-fit">
        <Watch name={"favorite"} control={control} render={renderCheckbox} />
      </Field>
    </Fieldset>
  );

  return owner ? (
    fieldset
  ) : (
    <Tooltip label="You can only rate your own movies">{fieldset}</Tooltip>
  );
};
