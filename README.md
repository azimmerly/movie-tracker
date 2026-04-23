# Movie Tracker

A full-stack web app for tracking, rating, and organizing movies into public or private lists. Search movies via The Movie Database API, rate them, mark favorites, and explore a stats dashboard showing your top genres and rating trends. Authentication supports email/password and GitHub social login, with data stored in PostgreSQL.

## Local Development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and populate the values
3. Start the database (requires Docker): `npm run db:up`
4. Push the database schema: `npm run db:push`
5. Start the dev server: `npm run dev`
