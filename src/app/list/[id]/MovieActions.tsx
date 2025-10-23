"use client";

import { Checkbox, Field, Label } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Watch } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { updateMovie } from "@/actions/movie";
import { Typography } from "@/components/ui/Typography";
import type { Movie, UpdateMovieData } from "@/types";
import { updateMovieSchema } from "@/utils/validation/movie";

type MovieActionsProps = {
  owner: boolean;
  movieId: Movie["id"];
  listId: Movie["listId"];
  rating: Movie["rating"];
  favorite: Movie["favorite"];
};

export const MovieActions = ({
  owner,
  movieId,
  listId,
  rating,
  favorite,
}: MovieActionsProps) => {
  const { control, formState, setValue, getValues, handleSubmit } =
    useForm<UpdateMovieData>({
      defaultValues: { favorite, rating, listId, movieId },
      resolver: zodResolver(updateMovieSchema),
    });

  const handleUpdate = async (
    field: "rating" | "favorite",
    value: Movie["rating"] | Movie["favorite"],
  ) => {
    if (formState.isSubmitting) {
      return;
    }
    if (!owner) {
      toast.info("You can only modify your own lists");
      return;
    }
    handleSubmit(async () => {
      setValue(field, value);
      const res = await updateMovie(getValues());
      if (!res.success) {
        toast.error(res.message);
      }
    })();
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

  return (
    <form className="mt-2 flex flex-col gap-1">
      <Field className="flex">
        <Watch
          names={["rating"]}
          control={control}
          render={([rating]: [number]) => renderStars(rating)}
        />
      </Field>
      <Field className="w-fit">
        <Watch
          names={["favorite"]}
          control={control}
          render={([favorite]: [boolean]) => (
            <Checkbox
              tabIndex={-1}
              disabled={formState.isSubmitting}
              checked={favorite}
              onChange={(e) => handleUpdate("favorite", e)}
              className={twMerge(
                "flex items-center gap-0.5 rounded-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden",
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
          )}
        />
      </Field>
    </form>
  );
};
