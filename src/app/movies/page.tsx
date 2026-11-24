import { browseMovies } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { MoviePoster } from "@/components/movies/MoviePoster";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";
import { BROWSE_MOVIES_MAX_RESULTS, BROWSE_MOVIES_PAGE_SIZE } from "@/consts";
import { handleInvalidPage, parsePage } from "@/utils/pagination";

type MoviesProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const Movies = async ({ searchParams }: MoviesProps) => {
  const { search, page } = await searchParams;
  const currentPage = parsePage(page);

  handleInvalidPage(
    currentPage,
    BROWSE_MOVIES_MAX_RESULTS,
    BROWSE_MOVIES_PAGE_SIZE,
  );

  const { data, success } = await browseMovies(currentPage, search);

  if (!success || !data) {
    return <ErrorMessage />;
  }

  const { movies, totalCount } = data;

  handleInvalidPage(currentPage, totalCount, BROWSE_MOVIES_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Typography.H1>Browse movies</Typography.H1>
          <Typography.Body muted>
            See what&apos;s popular, or search for something specific.
          </Typography.Body>
        </div>
        <SearchParamInput
          placeholder="Movie title"
          className="sm:w-72 sm:max-w-72 sm:shrink-0"
        />
      </div>
      <SearchResultMessage searchTerm={search} noun="movies" />
      {!!movies.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5">
          {movies.map((movie, index) => (
            <li
              key={movie.id}
              className="isolate overflow-hidden rounded-lg transition duration-200 ease-out hover:shadow-xl motion-safe:hover:scale-103"
            >
              <MoviePoster
                size="fill"
                alt={movie.title}
                posterPath={movie.posterPath}
                href={`/movie/${movie.id}`}
                priority={index < 10}
              />
            </li>
          ))}
        </ul>
      ) : (
        <NothingFound text="No movies found." />
      )}
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={BROWSE_MOVIES_PAGE_SIZE}
        itemLabel="movies"
        showSummary={!!search}
      />
    </div>
  );
};

export default Movies;
