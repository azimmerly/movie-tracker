import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("idx_session_userId_token").on(table.userId, table.token)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_account_userId").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_verification_identifier").on(table.identifier)],
);

export const movieList = pgTable(
  "movie_list",
  {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    private: boolean().default(false).notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_movieList_userId").on(table.userId),
    index("idx_movieList_createdAt").on(table.createdAt),
    index("idx_movieList_title").on(table.title),
  ],
);

export const movie = pgTable(
  "movie",
  {
    id: integer().primaryKey(),
    title: text().notNull(),
    posterPath: text().notNull(),
    imdbId: text(),
    overview: text(),
    tagline: text(),
    runtime: integer(),
    releaseDate: date().notNull(),
    genres: text().array().notNull(),
    cast: text().array().notNull(),
    directors: text().array().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_movie_title").on(table.title),
    index("idx_movie_releaseDate").on(table.releaseDate),
  ],
);

export const userMovie = pgTable(
  "user_movie",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    movieId: integer()
      .notNull()
      .references(() => movie.id, { onDelete: "cascade" }),
    rating: integer().default(0).notNull(),
    favorite: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_userMovie_userId_movieId").on(table.userId, table.movieId),
    index("idx_userMovie_rating").on(table.rating),
  ],
);

export const listMovie = pgTable(
  "list_movie",
  {
    id: uuid().defaultRandom().primaryKey(),
    listId: uuid()
      .notNull()
      .references(() => movieList.id, { onDelete: "cascade" }),
    movieId: integer()
      .notNull()
      .references(() => movie.id, { onDelete: "cascade" }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_listMovie_listId_movieId").on(table.listId, table.movieId),
    index("idx_listMovie_movieId").on(table.movieId),
  ],
);

export const movieListRelations = relations(movieList, ({ one, many }) => ({
  listMovies: many(listMovie),
  user: one(user, {
    fields: [movieList.userId],
    references: [user.id],
  }),
}));

export const movieRelations = relations(movie, ({ many }) => ({
  userMovies: many(userMovie),
  listMovies: many(listMovie),
}));

export const userMovieRelations = relations(userMovie, ({ one }) => ({
  user: one(user, {
    fields: [userMovie.userId],
    references: [user.id],
  }),
  movie: one(movie, {
    fields: [userMovie.movieId],
    references: [movie.id],
  }),
}));

export const listMovieRelations = relations(listMovie, ({ one }) => ({
  movieList: one(movieList, {
    fields: [listMovie.listId],
    references: [movieList.id],
  }),
  movie: one(movie, {
    fields: [listMovie.movieId],
    references: [movie.id],
  }),
}));
