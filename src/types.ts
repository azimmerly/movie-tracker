import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

import { movie, movieInfo, movieList } from "@/lib/db/schema";
import { addListSchema, updateListSchema } from "@/utils/validation/list";
import {
  addMovieSchema,
  deleteMovieSchema,
  movieSearchResponseSchema,
  movieSearchSchema,
  updateMovieSchema,
} from "@/utils/validation/movie";
import {
  signInSchema,
  signUpSchema,
  updateUserSchema,
} from "@/utils/validation/user";

// validation schema types
export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type AddListData = z.infer<typeof addListSchema>;
export type UpdateListData = z.infer<typeof updateListSchema>;
export type MovieSearchData = z.infer<typeof movieSearchSchema>;
export type MovieSearchResponseData = z.infer<typeof movieSearchResponseSchema>;
export type AddMovieData = z.infer<typeof addMovieSchema>;
export type UpdateMovieData = z.infer<typeof updateMovieSchema>;
export type DeleteMovieData = z.infer<typeof deleteMovieSchema>;

// db schema types
export type Movie = InferSelectModel<typeof movie>;
export type MovieInfo = InferSelectModel<typeof movieInfo>;
export type MovieList = InferSelectModel<typeof movieList>;
