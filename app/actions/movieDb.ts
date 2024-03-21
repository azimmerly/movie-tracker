"use server";

import { MovieDb } from "moviedb-promise";

import { formatNewMovie, formatSearchMovies } from "@/app/utils/format";
import { isValidSearchTerm } from "@/app/utils/validation";

const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

export const searchMovies = async (movieTitle: string) => {
  if (!isValidSearchTerm(movieTitle)) {
    return null;
  }

  try {
    const { results } = await moviedb.searchMovie({
      query: movieTitle,
      include_adult: false,
    });

    if (!results?.length) {
      return null;
    }

    return formatSearchMovies(results);
  } catch {
    return null;
  }
};

export const getMovie = async (movieId: number) => {
  try {
    const movie = await moviedb.movieInfo({ id: movieId });
    return formatNewMovie(movie);
  } catch {
    return null;
  }
};
