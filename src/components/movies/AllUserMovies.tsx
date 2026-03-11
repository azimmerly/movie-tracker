import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";

import { MovieActions } from "@/components/movies/MovieActions";
import { NothingFound } from "@/components/NothingFound";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, UserMovie } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getMovieImage } from "@/utils/getMovieImage";

type AllUserMoviesProps = {
  movies: {
    rating: UserMovie["rating"];
    favorite: UserMovie["favorite"];
    movie: Movie;
  }[];
  owner: boolean;
  emptyText: string;
};

export const AllUserMovies = ({
  movies,
  owner,
  emptyText,
}: AllUserMoviesProps) => {
  if (!movies.length) {
    return <NothingFound text={emptyText} />;
  }

  return (
    <ul className="divide-y divide-mist-200 dark:divide-mist-800">
      {movies.map(({ movie, favorite, rating }, index) => (
        <li key={movie.id} className="flex py-3">
          <div className="flex gap-3">
            <Link href={`/movie/${movie.id}`} className="rounded">
              <Image
                width={80}
                height={120}
                alt={movie.title}
                draggable={false}
                priority={index < 5}
                src={getMovieImage(movie.posterPath, "md")}
                className="h-27 w-18 min-w-18 rounded-md shadow sm:h-33 sm:w-22 sm:min-w-22"
              />
            </Link>
            <div>
              <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                <Link href={`/movie/${movie.id}`}>
                  <Typography.Body className="text-sm font-semibold sm:text-base">
                    {movie.title}
                  </Typography.Body>
                </Link>
                <Typography.Tiny muted className="flex items-center gap-0.5">
                  <CalendarDaysIcon className="mb-px size-3.5" />
                  {formatDate(movie.releaseDate)}
                </Typography.Tiny>
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {movie.genres.slice(0, 3).map((genre) => (
                  <Chip
                    key={genre}
                    text={genre}
                    variant="primary"
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1"
                  />
                ))}
              </div>
              <MovieActions
                owner={owner}
                movieId={movie.id}
                rating={rating}
                favorite={favorite}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
