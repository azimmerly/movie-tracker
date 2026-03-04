import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import { toast } from "sonner";

import { addMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, MovieSearchResponseData } from "@/types";
import { getMovieImage } from "@/utils/getMovieImage";

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
  const handleAddMovie = async () => {
    onMovieAdded(movie.id);
    const res = await addMovie({ listId, movieId: movie.id });
    if (res.success) {
      toast.success("Movie added");
    } else {
      onMovieAddFailed(movie.id);
      toast.error(res.message);
    }
  };

  return (
    <li key={movie.id} className="flex justify-between py-2">
      <div className="flex gap-3">
        <Image
          width={60}
          height={90}
          alt={movie.title}
          draggable={false}
          src={getMovieImage(movie.posterPath, "sm")}
          className="h-22.5 w-15 rounded shadow-sm"
        />
        <div className="flex flex-col gap-0.5">
          <Typography.Small className="font-semibold">
            {movie.title}
          </Typography.Small>
          <Typography.Tiny className="flex items-center gap-0.5" muted>
            <CalendarDaysIcon className="size-3.5" />
            {new Date(movie.releaseDate).getFullYear()}
          </Typography.Tiny>
          {isAdded ? (
            <Chip
              variant="success"
              className="pointer-events-none mt-1.5 px-2 py-1.25"
              text={
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="size-3.25" />
                  Added to list
                </span>
              }
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
