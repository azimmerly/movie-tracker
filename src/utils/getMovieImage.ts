import { MOVIE_DB_IMAGE_URL } from "@/consts";

const SIZE = {
  sm: "w154",
  md: "w342",
  lg: "w500",
} as const;

export const getMovieImage = (
  imagePath: string | null,
  size: keyof typeof SIZE,
) => `${MOVIE_DB_IMAGE_URL}/${SIZE[size]}${imagePath}`;
