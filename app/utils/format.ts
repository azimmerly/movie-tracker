import type { MovieResponse, MovieResult } from "moviedb-promise";

import type { MovieType } from "@/app/types";

export const formatSearchMovies = (movies: MovieResult[]) => {
  return movies
    .filter(
      (movie) =>
        !!movie.title &&
        !!movie.poster_path &&
        !!movie.release_date &&
        !!movie.genre_ids?.length,
    )
    .map((movie) => ({
      movieDbId: movie.id,
      title: movie.title,
      image: movie.poster_path,
      year: movie.release_date?.substring(0, 4),
    }))
    .slice(0, 15) as MovieType[];
};

export const formatNewMovie = (movie: MovieResponse) => {
  return {
    movieDbId: movie.id,
    imdbId: movie.imdb_id,
    title: movie.title,
    description: movie.overview,
    tagline: movie.tagline,
    runtime: movie.runtime,
    image: movie.poster_path,
    year: movie.release_date?.substring(0, 4),
    genres: movie.genres?.slice(0, 2).map(({ name }) => name),
  } as MovieType;
};

export const formatRuntime = (runtime: number) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  let result = "";

  if (hours > 0) {
    result += `${hours} hr`;
    if (minutes) {
      result += " ";
    }
  }

  if (minutes > 0) {
    result += `${minutes} min`;
  }

  return result;
};
