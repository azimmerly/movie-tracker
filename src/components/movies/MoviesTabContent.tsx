import { Squares2X2Icon } from "@heroicons/react/16/solid";

import { getUserMovies } from "@/actions/movie";
import { ActiveFilter } from "@/components/ActiveFilter";
import { ErrorMessage } from "@/components/ErrorMessage";
import { MovieSortSelect } from "@/components/movies/MovieSortSelect";
import { UserMovieRows } from "@/components/movies/UserMovieRows";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Typography } from "@/components/ui/Typography";
import { MOVIES_PAGE_SIZE } from "@/consts";
import { getOffset, handleInvalidPage } from "@/utils/pagination";

type MoviesTabContentProps = {
  userId: string;
  owner: boolean;
  search?: string;
  sort?: string;
  page?: number;
};

export const MoviesTabContent = async ({
  userId,
  owner,
  search,
  sort,
  page = 1,
}: MoviesTabContentProps) => {
  const offset = getOffset(page, MOVIES_PAGE_SIZE);
  const { data, success } = await getUserMovies(
    userId,
    MOVIES_PAGE_SIZE,
    offset,
    search,
    sort,
  );

  const movies = data?.movies;
  const totalCount = data?.totalCount ?? 0;

  handleInvalidPage(page, totalCount, MOVIES_PAGE_SIZE);

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <div className="mb-2 flex w-full min-w-0 items-center gap-1">
          <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
          <Typography.Body muted className="truncate">
            Tracked movies
          </Typography.Body>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2.25 sm:w-fit sm:flex-row">
          <SearchInput placeholder="Movie title or genre" />
          <MovieSortSelect />
        </div>
      </div>
      <ActiveFilter value={search} resource="movies" />
      {movies?.length ? (
        <UserMovieRows movies={movies} owner={owner} />
      ) : (
        <NothingFound
          text={
            owner
              ? "Movies added to your lists will appear here."
              : "No movies yet."
          }
        />
      )}
      <Pagination
        totalCount={totalCount}
        currentPage={page}
        pageSize={MOVIES_PAGE_SIZE}
        itemLabel="movies"
      />
    </>
  );
};
