import { ListBulletIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import { MovieListsDialog } from "@/components/movies/MovieListsDialog";
import { MovieRow } from "@/components/movies/MovieRow";
import { UserMovieOptions } from "@/components/movies/UserMovieOptions";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieList, UserMovie } from "@/types";

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
            <Typography.Small muted className="mt-2.5 flex items-center gap-1">
              <ListBulletIcon className="mt-px size-3.5 shrink-0" />
              {lists.length === 1 ? (
                <Link
                  href={`/list/${lists[0].id}`}
                  className="max-w-40 truncate hover:underline sm:max-w-72"
                >
                  {lists[0].title}
                </Link>
              ) : (
                <MovieListsDialog lists={lists} movieTitle={movie.title} />
              )}
            </Typography.Small>
          )}
        </MovieRow>
      ))}
    </ul>
  );
};
