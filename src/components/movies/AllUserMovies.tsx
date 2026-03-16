import { CalendarDaysIcon, ListBulletIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";

import { MovieActions } from "@/components/movies/MovieActions";
import { MovieListsDialog } from "@/components/movies/MovieListsDialog";
import { NothingFound } from "@/components/NothingFound";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, UserMovie } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getMovieImage } from "@/utils/getMovieImage";

const MAX_VISIBLE_LISTS = 2;

type AllUserMoviesProps = {
  movies: ({
    movie: Movie;
    lists: Pick<MovieList, "id" | "title">[];
  } & Pick<UserMovie, "rating" | "favorite">)[];
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
      {movies.map(({ movie, favorite, rating, lists }, index) => (
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
              {!!lists.length && (
                <Typography.Small
                  muted
                  className="mt-2 -mb-1 flex flex-wrap items-center gap-x-1 gap-y-0.5"
                >
                  <ListBulletIcon className="size-3.5 shrink-0" />
                  {lists.slice(0, MAX_VISIBLE_LISTS).map((list, i, arr) => (
                    <span key={list.id} className="flex items-center">
                      <Link
                        href={`/list/${list.id}`}
                        className="max-w-27 truncate hover:underline"
                      >
                        {list.title}
                      </Link>
                      {(i < arr.length - 1 ||
                        lists.length > MAX_VISIBLE_LISTS) && (
                        <span aria-hidden>,</span>
                      )}
                    </span>
                  ))}
                  {lists.length > MAX_VISIBLE_LISTS && (
                    <MovieListsDialog
                      lists={lists}
                      movieTitle={movie.title}
                      overflowCount={lists.length - MAX_VISIBLE_LISTS}
                    />
                  )}
                </Typography.Small>
              )}
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
