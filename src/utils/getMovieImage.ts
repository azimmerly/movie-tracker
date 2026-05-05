import { MOVIE_DB_IMAGE_URL } from "@/consts";

const SIZE = {
  sm: "w154",
  md: "w185",
  lg: "w780",
} as const;

export type MovieImageSize = keyof typeof SIZE;

export const getMovieImage = (imagePath: string, size: MovieImageSize) =>
  `${MOVIE_DB_IMAGE_URL}/${SIZE[size]}${imagePath}`;
