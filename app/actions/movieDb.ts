"use server";

import { MovieDb } from "moviedb-promise";

import { formatNewMovie, formatSearchMovies } from "@/app/utils/format";
import { isValidSearchTerm } from "@/app/utils/validation";

const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

export const searchMovies = async (movieTitle: string) => {
  if (!isValidSearchTerm(movieTitle)) {
    return;
  }

  const res = await moviedb.searchMovie({
    query: movieTitle,
    include_adult: false,
  });

  if (res.results?.length) {
    return formatSearchMovies(res.results);
  }

  return null;
};

export const getMovie = async (movieId: number) => {
  const movie = await moviedb.movieInfo({ id: movieId });

  return formatNewMovie(movie);
};
