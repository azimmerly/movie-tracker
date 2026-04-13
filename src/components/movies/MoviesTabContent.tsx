import { Squares2X2Icon } from "@heroicons/react/16/solid";

import { getUserMovies } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AllUserMovies } from "@/components/movies/AllUserMovies";
import { MovieSortSelect } from "@/components/movies/MovieSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Typography } from "@/components/ui/Typography";

type MoviesTabContentProps = {
  userId: string;
  owner: boolean;
  search?: string;
  sort?: string;
};

export const MoviesTabContent = async ({
  userId,
  owner,
  search,
  sort,
}: MoviesTabContentProps) => {
  const { data: movies, success } = await getUserMovies(userId, search, sort);

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <ScrollToTopButton />
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
    </>
  );
};
