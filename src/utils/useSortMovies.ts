import { useState } from "react";

import type { MovieWithInfo } from "@/types";

const sortOptions = [
  { value: "date", label: "Date added" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Movie title" },
  { value: "year", label: "Release year" },
];

export const useSortMovies = (movies: MovieWithInfo[]) => {
  const [sortBy, setSortBy] = useState(sortOptions[0]);

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy.value) {
      case "title":
        return a.movieInfo.title.localeCompare(b.movieInfo.title);
      case "rating":
        return b.rating - a.rating;
      case "date":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "year":
        return b.movieInfo.year - a.movieInfo.year;
      default:
        return 0;
    }
  });

  return { sortBy, setSortBy, sortOptions, sortedMovies };
};
