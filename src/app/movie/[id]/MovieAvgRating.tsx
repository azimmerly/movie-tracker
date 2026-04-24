import { StarIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";

import { getMovieAvgRating } from "@/actions/movie";
import { Typography } from "@/components/ui/Typography";
import type { Movie } from "@/types";

type MovieAvgRatingProps = {
  movieId: Movie["id"];
};

export const MovieAvgRating = async ({ movieId }: MovieAvgRatingProps) => {
  const avgRating = await getMovieAvgRating(movieId);

  return (
    <Typography.Small muted className="flex items-center gap-0.75">
      <StarIcon
        className={twMerge(
          "mb-px size-4.5",
          avgRating
            ? "fill-amber-400 dark:fill-amber-500"
            : "fill-mist-400 dark:fill-mist-500",
        )}
      />
      {avgRating ? `${avgRating.toFixed(1)} average rating` : "No ratings yet"}
    </Typography.Small>
  );
};
