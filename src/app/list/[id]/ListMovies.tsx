import { ActiveFilter } from "@/components/ActiveFilter";
import { MovieRow } from "@/components/movies/MovieRow";
import { MovieSortSelect } from "@/components/movies/MovieSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import type { Movie, MovieList, UserMovie } from "@/types";
import { AddMovieDialog } from "./AddMovieDialog";
import { ListMovieOptions } from "./ListMovieOptions";

type MoviesListProps = {
  movies: {
    rating: UserMovie["rating"];
    favorite: UserMovie["favorite"];
    movie: Movie;
  }[];
  owner: boolean;
  listId: MovieList["id"];
  search?: string;
  totalCount: number;
  page: number;
  pageSize: number;
};

export const ListMovies = ({
  movies,
  owner,
  listId,
  search,
  totalCount,
  page,
  pageSize,
}: MoviesListProps) => (
  <div className="mt-8">
    <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
      {owner && <AddMovieDialog listId={listId} />}
      <div className="flex w-full flex-col items-end justify-end gap-2.25 sm:flex-row">
        <SearchInput placeholder="Movie title or genre" />
        <MovieSortSelect />
      </div>
    </div>
    <ActiveFilter className="mt-10" resource="movies" value={search} />
    <div className="mt-8">
      {!movies.length ? (
        <NothingFound text="No movies yet." />
      ) : (
        <ul className="divide-y divide-mist-200 dark:divide-mist-800">
          {movies.map(({ movie, favorite, rating }, index) => (
            <MovieRow
              key={movie.id}
              movie={movie}
              owner={owner}
              rating={rating}
              favorite={favorite}
              priority={index < 5}
              options={
                <ListMovieOptions
                  owner={owner}
                  movieId={movie.id}
                  listId={listId}
                />
              }
            />
          ))}
        </ul>
      )}
    </div>
    <Pagination
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      itemLabel="movies"
    />
  </div>
);
