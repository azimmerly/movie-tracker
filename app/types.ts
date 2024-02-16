export type MovieType = {
  id: string;
  movieDbId: number;
  title: string;
  imdbId?: string;
  description?: string;
  tagline?: string;
  runtime?: number;
  image: string;
  year: string;
  genres: string[];
  isWatched: boolean;
  isFavorite: boolean;
};

export type ListType = {
  id: string;
  title: string;
  createdAt: string;
  isPublic: boolean;
  movies: MovieType[];
};
