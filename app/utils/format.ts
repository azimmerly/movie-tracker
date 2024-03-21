import type { MovieResponse, MovieResult } from "moviedb-promise";
import { z } from "zod";

import type { MovieType } from "@/app/types";

const searchMovieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    poster_path: z.string(),
    release_date: z.string(),
    genre_ids: z.array(z.number()).nonempty(),
  })
  .transform((data) => ({
    movieDbId: data.id,
    title: data.title,
    image: data.poster_path,
    year: data.release_date?.substring(0, 4),
  }));

const movieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    imdb_id: z.string().optional(),
    overview: z.string().optional(),
    tagline: z.string().optional(),
    runtime: z.number().optional(),
    poster_path: z.string(),
    release_date: z.string(),
    genres: z.array(z.object({ name: z.string() })).nonempty(),
  })
  .transform((data) => ({
    movieDbId: data.id,
    imdbId: data.imdb_id,
    title: data.title,
    description: data.overview,
    tagline: data.tagline,
    runtime: data.runtime,
    image: data.poster_path,
    year: data.release_date?.substring(0, 4),
    genres: data.genres?.slice(0, 2).map(({ name }) => name),
  }));

export const formatSearchMovies = (movies: MovieResult[]) => {
  return movies
    .map((movie) => searchMovieSchema.safeParse(movie))
    .filter((res) => res.success)
    .map((res) => res.success && res.data)
    .slice(0, 15) as MovieType[];
};

export const formatNewMovie = (movie: MovieResponse) => {
  const newMovie = movieSchema.safeParse(movie);
  return newMovie.success ? (newMovie.data as MovieType) : null;
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
