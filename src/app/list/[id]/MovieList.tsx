"use client";

import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type {
  ListMovie,
  Movie,
  MovieList as MovieListType,
  UserMovie,
} from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getMovieImage } from "@/utils/getMovieImage";
import { AddMovieDialog } from "./AddMovieDialog";
import { MovieActions } from "./MovieActions";
import { MovieOptions } from "./MovieOptions";
import { MovieSortSelect } from "./MovieSortSelect";

type MoviesListProps = {
  owner: boolean;
  movies: {
    id: ListMovie["id"];
    createdAt: ListMovie["createdAt"];
    rating: UserMovie["rating"];
    favorite: UserMovie["favorite"];
    movie: Movie;
  }[];
  listId: MovieListType["id"];
};

export const MovieList = ({ movies, owner, listId }: MoviesListProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const listMovieIds = new Set(movies.map(({ movie }) => movie.id));

  return (
    <div className="mt-6">
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        {owner && (
          <AddMovieDialog listId={listId} listMovieIds={listMovieIds} />
        )}
        <div className="flex w-full flex-col items-end justify-end gap-2 sm:flex-row">
          <SearchParamInput placeholder="Movie title" />
          <MovieSortSelect />
        </div>
      </div>

      {search && <SearchResultMessage className="mt-10" searchTerm={search} />}

      <div className="mt-8">
        {!movies.length ? (
          <NothingFound text="No movies here… yet." />
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {movies.map(({ id, movie, favorite, rating }, index) => (
              <li key={id} className="flex justify-between py-3">
                <div className="flex gap-3">
                  <Link href={`/movie/${movie.id}`} className="rounded">
                    <Image
                      width={80}
                      height={120}
                      alt={movie.title}
                      draggable={false}
                      priority={index < 5}
                      src={getMovieImage(movie.posterPath, "md")}
                      className="h-auto w-16 min-w-16 rounded shadow sm:w-20 sm:min-w-20"
                    />
                  </Link>
                  <div>
                    <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                      <Typography.Body className="text-sm font-semibold sm:text-base">
                        {movie.title}
                      </Typography.Body>
                      <Typography.Tiny
                        muted
                        className="flex items-center gap-0.5"
                      >
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
                          className="px-1.5 py-0.5 font-semibold sm:px-2 sm:py-1"
                        />
                      ))}
                    </div>
                    <MovieActions
                      owner={owner}
                      movieId={movie.id}
                      listId={listId}
                      rating={rating}
                      favorite={favorite}
                    />
                  </div>
                </div>
                <MovieOptions
                  owner={owner}
                  movieId={movie.id}
                  listId={listId}
                  movie={movie}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
