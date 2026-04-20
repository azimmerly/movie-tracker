import { Squares2X2Icon } from "@heroicons/react/16/solid";
import { notFound } from "next/navigation";

import { getUserMovies } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AllUserMovies } from "@/components/movies/AllUserMovies";
import { MovieSortSelect } from "@/components/movies/MovieSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";

type MoviesTabContentProps = {
  userId: string;
  owner: boolean;
  search?: string;
  sort?: string;
  page?: number;
};

const MOVIES_PAGE_SIZE = 20;

export const MoviesTabContent = async ({
  userId,
  owner,
  search,
  sort,
  page = 1,
}: MoviesTabContentProps) => {
  const offset = MOVIES_PAGE_SIZE * (page - 1);
  const { data, success } = await getUserMovies(
    userId,
    MOVIES_PAGE_SIZE,
    offset,
    search,
    sort,
  );

  const movies = data?.movies;
  const totalCount = data?.totalCount ?? 0;

  if (totalCount > 0 && page > Math.ceil(totalCount / MOVIES_PAGE_SIZE)) {
    notFound();
  }

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <div className="mb-2 flex w-full min-w-0 items-center gap-1">
          <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
          <Typography.Body muted className="truncate">
            {owner
              ? "All movies you've tracked"
              : "All movies this user has tracked"}
          </Typography.Body>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-fit sm:flex-row">
          <SearchParamInput placeholder="Movie title" />
          <MovieSortSelect />
        </div>
      </div>

      {search && <SearchResultMessage searchTerm={search} />}

      {movies?.length ? (
        <AllUserMovies movies={movies} owner={owner} />
      ) : (
        <NothingFound
          text={
            owner
              ? "Movies added to your lists will appear here."
              : "No movies here… yet."
          }
        />
      )}

      {totalCount > MOVIES_PAGE_SIZE && (
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={MOVIES_PAGE_SIZE}
          itemLabel="movies"
        />
      )}
    </>
  );
};
