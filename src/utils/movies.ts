import { MovieWithInfo } from "@/types";

export const sortMovies = (movies: MovieWithInfo[], sortBy?: string) => {
  return [...movies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.movieInfo.title.localeCompare(b.movieInfo.title);
      case "rating":
        return b.rating - a.rating;
      case "date":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "year":
        return b.movieInfo.year - a.movieInfo.year;
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
};
