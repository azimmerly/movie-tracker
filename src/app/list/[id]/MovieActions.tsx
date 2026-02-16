"use client";

import { Checkbox, Field, Fieldset, Label } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Watch } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { updateMovie } from "@/actions/movie";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, UpdateMovieData, UserMovie } from "@/types";
import { updateMovieSchema } from "@/utils/validation/movie";

type MovieActionsProps = {
  owner: boolean;
  movieId: Movie["id"];
  listId: MovieList["id"];
  rating: UserMovie["rating"];
  favorite: UserMovie["favorite"];
};

export const MovieActions = ({
  owner,
  movieId,
  listId,
  rating,
  favorite,
}: MovieActionsProps) => {
  const { control, formState, setValue, getValues } = useForm<UpdateMovieData>({
    defaultValues: { favorite, rating, listId, movieId },
    resolver: zodResolver(updateMovieSchema),
  });

  const handleUpdate = async (
    field: "rating" | "favorite",
    value: UserMovie["rating"] | UserMovie["favorite"],
  ) => {
    if (!owner) {
      toast.info("You can only modify your own lists");
      return;
    } else if (formState.isSubmitting) {
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
      const starNum = index + 1;
      return (
        <StarIcon
          role="button"
          key={starNum}
          className={twMerge(
            "-mx-px size-5",
            owner ? "cursor-pointer" : "cursor-default",
            rating >= starNum
              ? "fill-amber-400 dark:fill-amber-500"
              : "fill-gray-300 dark:fill-gray-600",
          )}
          onClick={() => {
            handleUpdate("rating", rating === starNum ? 0 : starNum);
          }}
        />
      );
    });
  };

  const renderCheckbox = (favorite: boolean) => (
    <Checkbox
      tabIndex={-1}
      checked={favorite}
      onChange={(e) => handleUpdate("favorite", e)}
      className={twMerge(
        "flex items-center gap-0.5",
        owner ? "cursor-pointer" : "cursor-default",
      )}
    >
      <HeartIcon
        strokeWidth={2}
        className={twMerge(
          "size-5 text-rose-400 dark:text-rose-500",
          favorite && "fill-rose-400 dark:fill-rose-500",
        )}
      />
      <Label as={Typography.Tiny} className="font-medium" muted>
        Favorite
      </Label>
    </Checkbox>
  );

  return (
    <Fieldset className="mt-2 flex flex-col gap-1">
      <Field className="flex">
        <Watch name={"rating"} control={control} render={renderStars} />
      </Field>
      <Field className="w-fit">
        <Watch name={"favorite"} control={control} render={renderCheckbox} />
      </Field>
    </Fieldset>
  );
};
