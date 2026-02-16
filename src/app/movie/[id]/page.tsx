import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAllMovieIds, getMovie } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import { IMDB_MOVIE_URL } from "@/consts";
import { formatDate } from "@/utils/formatDate";
import { formatRuntime } from "@/utils/formatRuntime";
import { getMovieImage } from "@/utils/getMovieImage";

type MoviePageProps = {
  params: Promise<{ id: number }>;
};

export const generateStaticParams = async () => {
  const { data, success } = await getAllMovieIds();
  if (!success) {
    return [];
  }
  return data ?? [];
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { id } = await params;
  const { data: movie, success } = await getMovie(id);

  if (!success) {
    return <ErrorMessage />;
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-8 sm:mt-18">
      <Image
        priority
        width={240}
        height={360}
        alt={movie.title}
        draggable={false}
        src={getMovieImage(movie.posterPath, "lg")}
        className="h-75 w-50 rounded-lg shadow sm:h-90 sm:w-60"
      />
      <div className="flex flex-col items-center gap-2">
        <Typography.H2 className="max-w-2xl text-center">
          {movie.title}
        </Typography.H2>
        {movie.tagline && (
          <Typography.Small
            muted
            className="max-w-md text-center"
          >{`"${movie.tagline}"`}</Typography.Small>
        )}
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1">
          {movie.genres.slice(0, 3).map((genre) => (
            <Chip
              key={genre}
              text={genre}
              variant="primary"
              className="font-semibold"
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {!!movie.runtime && (
            <Typography.Small muted className="flex items-center gap-1">
              <ClockIcon className="size-4" strokeWidth={2} />
              {formatRuntime(movie.runtime)}
            </Typography.Small>
          )}
          {movie.releaseDate && (
            <Typography.Small muted className="flex items-center gap-1">
              <CalendarDaysIcon className="size-4" />
              {formatDate(movie.releaseDate)}
            </Typography.Small>
          )}
          {movie.imdbId && (
            <Typography.Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${IMDB_MOVIE_URL}/${movie.imdbId}`}
              className="flex items-center gap-1 text-sm font-medium"
            >
              <ArrowTopRightOnSquareIcon className="size-4" />
              View on IMDb
            </Typography.Link>
          )}
        </div>
      </div>
      {movie.overview && (
        <Typography.Small className="max-w-lg border-l-2 border-blue-500/60 px-2 text-justify">
          {movie.overview}
        </Typography.Small>
      )}
    </div>
  );
};

export default MoviePage;
