import { Squares2X2Icon } from "@heroicons/react/16/solid";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovies } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AllUserMovies } from "@/components/movies/AllUserMovies";
import { MovieSortSelect } from "@/components/movies/MovieSortSelect";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";

type UserMoviesProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const UserMovies = async ({ searchParams, params }: UserMoviesProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/movies");
  }

  const { data: movies, success } = await getUserMovies(id, search, sort);
  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <div className="mb-2 flex w-full min-w-0 items-center gap-1">
          <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
          <Typography.Body muted className="truncate">
            All movies this user has tracked
          </Typography.Body>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-fit sm:flex-row">
          <SearchParamInput placeholder="Movie title" />
          <MovieSortSelect />
        </div>
      </div>

      {search && <SearchResultMessage searchTerm={search} />}

      <AllUserMovies
        movies={movies ?? []}
        owner={false}
        emptyText="No movies here… yet."
      />
    </>
  );
};

export default UserMovies;
