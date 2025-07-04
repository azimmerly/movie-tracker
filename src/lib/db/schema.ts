import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
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

export const session = pgTable("session", {
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
});

export const account = pgTable("account", {
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
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const movieList = pgTable("movie_list", {
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
});

export const movie = pgTable("movie", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  listId: uuid()
    .notNull()
    .references(() => movieList.id, { onDelete: "cascade" }),
  movieInfoId: integer()
    .notNull()
    .references(() => movieInfo.id, { onDelete: "cascade" }),
  rating: integer().default(0).notNull(),
  favorite: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const movieInfo = pgTable("movie_info", {
  id: integer().primaryKey(),
  title: text().notNull(),
  imagePath: text().notNull(),
  imdbId: text(),
  description: text(),
  tagline: text(),
  runtime: integer(),
  releaseDate: date().notNull(),
  genres: text().array().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const movieListRelations = relations(movieList, ({ one, many }) => ({
  movies: many(movie),
  user: one(user, {
    fields: [movieList.userId],
    references: [user.id],
  }),
}));

export const movieInfoRelations = relations(movieInfo, ({ many }) => ({
  movies: many(movie),
}));

export const movieRelations = relations(movie, ({ one }) => ({
  user: one(user, {
    fields: [movie.userId],
    references: [user.id],
  }),
  movieList: one(movieList, {
    fields: [movie.listId],
    references: [movieList.id],
  }),
  movieInfo: one(movieInfo, {
    fields: [movie.movieInfoId],
    references: [movieInfo.id],
  }),
}));
