"use client";

import { Checkbox, Field, Fieldset } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { updateMovie } from "@/actions/movie";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Movie, UpdateMovieData, UserMovie } from "@/types";
import { updateMovieSchema } from "@/utils/validation/movie";

type MovieActionsProps = {
  owner: boolean;
  movieId: Movie["id"];
} & Pick<UserMovie, "rating" | "favorite">;

export const MovieActions = ({
  owner,
  movieId,
  rating,
  favorite,
}: MovieActionsProps) => {
  const router = useRouter();
  const [starTick, setStarTick] = useState(0);
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
      if (res.success) {
        router.refresh();
      } else {
        revertUpdate();
        toast.error(res.message);
      }
    } catch {
      revertUpdate();
      toast.error("Something went wrong");
    }
  };

  const renderStars = (rating: UserMovie["rating"]) => {
    return Array.from({ length: 5 }, (_, index) => {
      const fullValue = (index + 1) * 2;
      const halfValue = fullValue - 1;
      const isFull = rating >= fullValue;
      const isHalf = !isFull && rating >= halfValue;
      const isFilled = isFull || isHalf;

      return (
        <span
          key={isFilled ? `${index}-${starTick}` : `${index}-stable`}
          className={twMerge(
            "relative -mx-px size-5.5",
            isFilled && "animate-pop-in",
          )}
        >
          <StarIcon className="size-5.5 fill-mist-200 dark:fill-mist-700" />
          {(isFull || isHalf) && (
            <StarIcon
              className={twMerge(
                "absolute inset-0 size-5.5 fill-amber-400 dark:fill-amber-500",
                isHalf && "[clip-path:inset(0_50%_0_0)]",
              )}
            />
          )}
          {owner && (
            <>
              <span
                role="button"
                className="absolute top-0 left-0 h-full w-1/2 cursor-pointer"
                onClick={() => {
                  setStarTick((t) => t + 1);
                  handleUpdate("rating", rating === halfValue ? 0 : halfValue);
                }}
              />
              <span
                role="button"
                className="absolute top-0 right-0 h-full w-1/2 cursor-pointer"
                onClick={() => {
                  setStarTick((t) => t + 1);
                  handleUpdate("rating", rating === fullValue ? 0 : fullValue);
                }}
              />
            </>
          )}
        </span>
      );
    });
  };

  const renderCheckbox = (favorite: UserMovie["favorite"]) => (
    <Checkbox
      tabIndex={-1}
      checked={favorite}
      onChange={(e) => handleUpdate("favorite", e)}
      className={twMerge(
        "mt-px ml-px flex items-center",
        owner ? "cursor-pointer" : "cursor-default",
      )}
    >
      <HeartIcon
        key={+favorite}
        className={twMerge(
          "size-5.25",
          favorite
            ? "animate-pop-in fill-rose-400 dark:fill-rose-500"
            : "fill-mist-200 dark:fill-mist-700",
        )}
      />
    </Checkbox>
  );

  const fieldset = (
    <Fieldset className="mt-2.25 flex items-center">
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
    <Tooltip label="You can only rate/favorite your own movies">
      {fieldset}
    </Tooltip>
  );
};
