import { z } from "zod";

export const addMovieSchema = z.object({
  listId: z.string(),
  movieId: z.number(),
});

export const deleteMovieSchema = z.object({
  listId: z.string(),
  movieId: z.string(),
});

export const updateMovieSchema = z.object({
  listId: z.string(),
  movieId: z.string(),
  rating: z.number().min(0).max(5),
  favorite: z.boolean(),
});

export const movieSearchSchema = z.object({
  title: z.string().trim().min(1, { message: "Required" }),
});

export const movieSearchResponseSchema = z
  .object({
    results: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        release_date: z.string(),
        poster_path: z.string().nullable(),
        genre_ids: z.array(z.number()),
      }),
    ),
  })
  .transform(({ results }) => {
    const today = new Date().toISOString().split("T")[0];
    return results
      .filter((movie) => {
        return (
          !!movie.release_date &&
          !!movie.poster_path &&
          movie.genre_ids.length > 0 &&
          movie.release_date <= today
        );
      })
      .slice(0, 15)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date.substring(0, 4),
        imagePath: movie.poster_path,
      }));
  });

export const movieDetailsResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    imdb_id: z.string().nullable(),
    overview: z.string().nullable(),
    tagline: z.string().nullable(),
    runtime: z.number().nullable(),
    poster_path: z.string(),
    release_date: z.string(),
    genres: z.array(z.object({ name: z.string() })),
  })
  .transform((data) => ({
    id: data.id,
    title: data.title,
    imdbId: data.imdb_id || null,
    description: data.overview || null,
    tagline: data.tagline || null,
    runtime: data.runtime || null,
    imagePath: data.poster_path,
    year: parseInt(data.release_date.substring(0, 4)),
    genres: data.genres.map(({ name }) => name),
  }));
