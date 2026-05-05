import { MOVIE_DB_IMAGE_URL } from "@/consts";

const SIZE = {
  sm: "w154",
  md: "w185",
  lg: "w780",
} as const;

export const getMovieImage = (imagePath: string, size: keyof typeof SIZE) =>
  `${MOVIE_DB_IMAGE_URL}/${SIZE[size]}${imagePath}`;
