import { Squares2X2Icon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovies } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { MovieActions } from "@/components/MovieActions";
import { MovieSortSelect } from "@/components/MovieSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { getMovieImage } from "@/utils/getMovieImage";

type MyMoviesProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const MyMovies = async ({ searchParams }: MyMoviesProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: movies, success } = await getUserMovies(
    session.user.id,
    search,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <div className="mb-2 flex w-full min-w-0 items-center gap-1">
          <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
          <Typography.Body muted className="truncate">
            All movies you&apos;ve tracked
          </Typography.Body>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-fit sm:flex-row">
          <SearchParamInput placeholder="Movie title" />
          <MovieSortSelect />
        </div>
      </div>

      {search && <SearchResultMessage searchTerm={search} />}

      <div>
        {!movies?.length ? (
          <NothingFound text="Movies added to your lists will appear here." />
        ) : (
          <ul className="divide-y divide-mist-200 dark:divide-mist-800">
            {movies.map(({ id, movie, favorite, rating }, index) => (
              <li key={id} className="flex py-3">
                <div className="flex gap-3">
                  <Link href={`/movie/${movie.id}`} className="rounded">
                    <Image
                      width={80}
                      height={120}
                      alt={movie.title}
                      draggable={false}
                      priority={index < 5}
                      src={getMovieImage(movie.posterPath, "md")}
                      className="h-auto w-18 min-w-18 rounded-md shadow sm:w-22 sm:min-w-22"
                    />
                  </Link>
                  <div>
                    <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                      <Link href={`/movie/${movie.id}`}>
                        <Typography.Body className="text-sm font-semibold sm:text-base">
                          {movie.title}
                        </Typography.Body>
                      </Link>
                      <Typography.Tiny
                        muted
                        className="flex items-center gap-0.75"
                      >
                        <CalendarDaysIcon className="mb-px size-3.5" />
                        {formatDate(movie.releaseDate)}
                      </Typography.Tiny>
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <Chip
                          key={genre}
                          text={genre}
                          variant="primary"
                          className="px-1.5 py-0.5 sm:px-2 sm:py-1"
                        />
                      ))}
                    </div>
                    <MovieActions
                      owner={true}
                      movieId={movie.id}
                      rating={rating}
                      favorite={favorite}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyMovies;
