import { ListBulletIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import { MovieListsDialog } from "@/components/movies/MovieListsDialog";
import { MovieRow } from "@/components/movies/MovieRow";
import { UserMovieOptions } from "@/components/movies/UserMovieOptions";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, UserMovie } from "@/types";

const MAX_VISIBLE_LISTS = 2;

type AllUserMoviesProps = {
  owner: boolean;
  movies: ({
    movie: Movie;
    lists: Pick<MovieList, "id" | "title">[];
  } & Pick<UserMovie, "rating" | "favorite">)[];
};

export const AllUserMovies = ({ movies, owner }: AllUserMoviesProps) => {
  return (
    <ul className="divide-y divide-mist-200 dark:divide-mist-800">
      {movies.map(({ movie, favorite, rating, lists }, index) => (
        <MovieRow
          key={movie.id}
          movie={movie}
          owner={owner}
          rating={rating}
          favorite={favorite}
          priority={index < 5}
          options={
            <UserMovieOptions
              movieId={movie.id}
              owner={owner}
              listCount={lists.length}
            />
          }
        >
          {!!lists.length && (
            <Typography.Small
              muted
              className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-0.5"
            >
              <ListBulletIcon className="mt-px size-3.5 shrink-0" />
              {lists.slice(0, MAX_VISIBLE_LISTS).map((list, i, arr) => (
                <span key={list.id} className="flex items-center">
                  <Link
                    href={`/list/${list.id}`}
                    className="max-w-25 truncate hover:underline sm:max-w-40"
                  >
                    {list.title}
                  </Link>
                  {(i < arr.length - 1 || lists.length > MAX_VISIBLE_LISTS) && (
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
        </MovieRow>
      ))}
    </ul>
  );
};
