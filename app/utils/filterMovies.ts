import type { MovieType } from "@/app/types";

export const filterMovies = (movies: MovieType[], sortBy: string) => {
  switch (sortBy) {
    case "all":
      return movies;
    case "favorite":
      return movies.filter(({ isFavorite }) => isFavorite);
    case "watched":
      return movies.filter(({ isWatched }) => isWatched);
    default:
      return movies;
  }
};
