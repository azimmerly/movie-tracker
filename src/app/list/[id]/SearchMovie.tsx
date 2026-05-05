"use client";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addMovie } from "@/actions/movie";
import { MoviePoster } from "@/components/movies/MoviePoster";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, MovieSearchResponseData } from "@/types";
import { formatDate } from "@/utils/formatDate";

type SearchMovieProps = {
  movie: MovieSearchResponseData[number];
  listId: MovieList["id"];
  isAdded: boolean;
  onMovieAdded: (id: Movie["id"]) => void;
  onMovieAddFailed: (id: Movie["id"]) => void;
};

export const SearchMovie = ({
  movie,
  listId,
  isAdded,
  onMovieAdded,
  onMovieAddFailed,
}: SearchMovieProps) => {
  const router = useRouter();

  const handleAddMovie = async () => {
    onMovieAdded(movie.id);
    const res = await addMovie({ listId, movieId: movie.id });
    if (res.success) {
      toast.success("Movie added");
      router.refresh();
    } else {
      onMovieAddFailed(movie.id);
      toast.error(res.message);
    }
  };

  return (
    <li className="flex justify-between py-2">
      <div className="flex gap-3">
        <MoviePoster
          size="sm"
          alt={movie.title}
          posterPath={movie.posterPath}
        />
        <div className="flex flex-col gap-0.5">
          <Typography.Small className="font-semibold">
            {movie.title}
          </Typography.Small>
          <Typography.Tiny className="flex items-center gap-0.5" muted>
            <CalendarDaysIcon className="size-3.5" />
            {formatDate(movie.releaseDate)}
          </Typography.Tiny>
          {isAdded ? (
            <Chip
              variant="success"
              icon={CheckCircleIcon}
              className="pointer-events-none mt-1.5 px-2 py-1.25"
              text="Added to list"
            />
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="mt-1.5 text-blue-600 dark:text-blue-500"
              icon={PlusCircleIcon}
              onClick={handleAddMovie}
            >
              Add movie
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};
