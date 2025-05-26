"use client";

import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

import ticketImage from "@/assets/ticket.png";
import { Chip } from "@/components/ui/Chip";
import { Select } from "@/components/ui/Select";
import { Typography } from "@/components/ui/Typography";
import type { Movie, MovieWithInfo } from "@/types";
import { getMovieImage } from "@/utils/getMovieImage";
import { useSortMovies } from "@/utils/useSortMovies";
import { AddMovieDialog } from "./AddMovieDialog";
import { MovieActions } from "./MovieActions";
import { MovieOptions } from "./MovieOptions";

type MoviesListProps = {
  owner: boolean;
  movies: MovieWithInfo[];
  listId: Movie["listId"];
};

export const MovieList = ({ movies, owner, listId }: MoviesListProps) => {
  const listMovieIds = new Set(movies.map(({ movieInfo }) => movieInfo.id));
  const { sortBy, setSortBy, sortOptions, sortedMovies } =
    useSortMovies(movies);

  return (
    <div className="mt-6">
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        {owner && (
          <AddMovieDialog listId={listId} listMovieIds={listMovieIds} />
        )}
        <Select
          label="Sort by"
          options={sortOptions}
          selected={sortBy}
          setSelected={setSortBy}
          className="w-full self-start sm:w-40"
        />
      </div>
      <div className="mt-8">
        {!sortedMovies.length ? (
          <div className="mt-28 text-center">
            <Image
              priority
              draggable={false}
              src={ticketImage}
              alt="movie ticket"
              className="animation-iterate-1 mx-auto size-20"
            />
            <Typography.Body muted className="font-medium">
              This list is still waiting for some movies to be added...
            </Typography.Body>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedMovies.map(
              ({ id, listId, movieInfo, favorite, rating }, index) => (
                <li key={id} className="flex justify-between py-3">
                  <div className="flex gap-3">
                    <Link href={`/movie/${movieInfo.id}`} className="rounded">
                      <Image
                        width={80}
                        height={120}
                        alt={movieInfo.title}
                        draggable={false}
                        priority={index < 5}
                        src={getMovieImage(movieInfo.imagePath, "md")}
                        className="h-auto w-16 min-w-16 rounded shadow sm:w-20 sm:min-w-20"
                      />
                    </Link>
                    <div>
                      <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <Typography.Body className="text-sm font-semibold sm:text-base">
                          {movieInfo.title}
                        </Typography.Body>
                        <Typography.Tiny
                          muted
                          className="flex items-center gap-0.5"
                        >
                          <CalendarDaysIcon className="size-3.5" />
                          {movieInfo.year}
                        </Typography.Tiny>
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {movieInfo.genres.slice(0, 3).map((genre) => (
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
                        movieId={id}
                        listId={listId}
                        rating={rating}
                        favorite={favorite}
                      />
                    </div>
                  </div>
                  <MovieOptions
                    owner={owner}
                    movieId={id}
                    listId={listId}
                    movieInfo={movieInfo}
                  />
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
