import { StarIcon } from "@heroicons/react/16/solid";

import { getMovieAvgRating } from "@/actions/movie";
import { Typography } from "@/components/ui/Typography";
import type { Movie } from "@/types";

type MovieAvgRatingProps = {
  movieId: Movie["id"];
};

export const MovieAvgRating = async ({ movieId }: MovieAvgRatingProps) => {
  const avgRating = await getMovieAvgRating(movieId);

  if (!avgRating) {
    return null;
  }

  return (
    <Typography.Small muted className="flex items-center gap-0.75">
      <StarIcon className="mb-px size-4.5 fill-amber-400 dark:fill-amber-500" />
      {avgRating.toFixed(1)} average rating
    </Typography.Small>
  );
};
