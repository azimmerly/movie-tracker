"use client";

import { Checkbox, Field, Label } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  const { formState, setValue, getValues, watch, handleSubmit } =
    useForm<UpdateMovieData>({
      defaultValues: { favorite, rating, listId, movieId },
      resolver: zodResolver(updateMovieSchema),
    });

  const handleUpdate = async (
    field: "rating" | "favorite",
    value: Movie["rating"] | Movie["favorite"],
  ) => {
    if (!owner) {
      toast.info("Only lists you own can be modified");
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

  const currentRating = watch("rating");
  const currentFavorite = watch("favorite");

  return (
    <form className="mt-2 flex flex-col gap-1">
      <Field className="flex">
        {Array.from({ length: 5 }).map((_, index) => {
          const starNum = index + 1;
          return (
            <StarIcon
              key={starNum}
              className={twMerge(
                "-mx-px size-5",
                owner ? "cursor-pointer" : "cursor-default",
                currentRating >= starNum
                  ? "fill-amber-400 dark:fill-amber-500"
                  : "fill-gray-300 dark:fill-gray-600",
              )}
              onClick={() => {
                if (formState.isSubmitting) {
                  return;
                }
                if (currentRating === starNum) {
                  handleUpdate("rating", 0);
                } else if (currentRating !== starNum) {
                  handleUpdate("rating", starNum);
                }
              }}
            />
          );
        })}
      </Field>
      <Field>
        <Checkbox
          disabled={formState.isSubmitting}
          checked={currentFavorite}
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
              currentFavorite && "fill-rose-400 dark:fill-rose-500",
            )}
          />
          <Label as={Typography.Tiny} className="font-medium" muted>
            Favorite
          </Label>
        </Checkbox>
      </Field>
    </form>
  );
};
