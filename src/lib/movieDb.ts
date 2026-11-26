import { createFetch } from "@better-fetch/fetch";

import { CACHE_ONE_DAY, MOVIE_DB_API_URL } from "@/consts";
import { env } from "@/env";
import type { Movie } from "@/types";
import {
  movieBrowseResponseSchema,
  movieDetailsResponseSchema,
  movieSearchResponseSchema,
} from "@/utils/validation/movie";

const LANGUAGE = "en-US";

const movieDbFetch = createFetch({
  retry: 2,
  timeout: 5000,
  throw: true,
  baseURL: MOVIE_DB_API_URL,
  method: "GET",
  headers: {
    accept: "application/json",
    authorization: `Bearer ${env.MOVIEDB_API_KEY}`,
  },
});

export const fetchMovieDbMovie = (id: Movie["id"]) =>
  movieDbFetch("/movie/:id", {
    params: { id: id.toString() },
    query: { append_to_response: "credits", language: LANGUAGE },
    output: movieDetailsResponseSchema,
    next: { revalidate: CACHE_ONE_DAY },
  });

export const browseMovieDb = (page: number, query?: string) => {
  const options = {
    output: movieBrowseResponseSchema,
    next: { revalidate: CACHE_ONE_DAY },
  };

  if (query) {
    return movieDbFetch("/search/movie", {
      ...options,
      query: { query, include_adult: false, language: LANGUAGE },
    });
  }

  return movieDbFetch("/movie/popular", {
    ...options,
    query: { page, language: LANGUAGE },
  });
};

export const searchMovieDb = (title: string) =>
  movieDbFetch("/search/movie", {
    output: movieSearchResponseSchema,
    query: { query: title, include_adult: false, language: LANGUAGE },
    next: { revalidate: CACHE_ONE_DAY },
  });
