import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  LanguageIcon,
} from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAllMovieIds, getMovie } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import { IMDB_MOVIE_URL } from "@/consts";
import { formatDate } from "@/utils/formatDate";
import { formatLanguage } from "@/utils/formatLanguage";
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
    <div className="flex flex-col items-center gap-7 sm:mt-8">
      <Image
        priority
        width={240}
        height={360}
        alt={movie.title}
        draggable={false}
        src={getMovieImage(movie.posterPath, "lg")}
        className="h-75 w-50 rounded-lg shadow sm:h-90 sm:w-60"
      />
      <div className="flex flex-col items-center gap-2.5">
        <Typography.H2 className="max-w-2xl text-center">
          {movie.title}
        </Typography.H2>
        {movie.tagline && (
          <Typography.Small
            muted
            className="max-w-md text-center italic"
          >{`"${movie.tagline}"`}</Typography.Small>
        )}
        <div className="flex flex-wrap justify-center gap-1">
          {movie.genres.slice(0, 3).map((genre) => (
            <Chip key={genre} text={genre} variant="primary" />
          ))}
        </div>
      </div>
      <div className="flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {!!movie.runtime && (
          <Typography.Small muted className="flex items-center gap-0.5">
            <ClockIcon className="size-4" strokeWidth={2} />
            {formatRuntime(movie.runtime)}
          </Typography.Small>
        )}
        {!!movie.releaseDate && (
          <Typography.Small muted className="flex items-center gap-0.75">
            <CalendarDaysIcon className="size-4" />
            {formatDate(movie.releaseDate)}
          </Typography.Small>
        )}
        {!!movie.language && (
          <Typography.Small muted className="flex items-center gap-0.5">
            <LanguageIcon className="size-4" />
            {formatLanguage(movie.language)}
          </Typography.Small>
        )}
        {!!movie.imdbId && (
          <Typography.Link
            target="_blank"
            rel="noopener noreferrer"
            href={`${IMDB_MOVIE_URL}/${movie.imdbId}`}
            className="flex items-center gap-0.75 text-sm font-medium"
          >
            <ArrowTopRightOnSquareIcon className="size-4" />
            IMDb
          </Typography.Link>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        {!!movie.directors?.length && (
          <div className="max-w-md">
            <Typography.Small className="font-semibold">
              Directed by
            </Typography.Small>
            <Typography.Small muted>
              {movie.directors.join(", ")}
            </Typography.Small>
          </div>
        )}
        {!!movie.cast?.length && (
          <div className="max-w-md">
            <Typography.Small className="font-semibold">Cast</Typography.Small>
            <Typography.Small muted>{movie.cast.join(", ")}</Typography.Small>
          </div>
        )}
        {!!movie.overview && (
          <div className="max-w-xl">
            <Typography.Small className="font-semibold">
              Overview
            </Typography.Small>
            <Typography.Small muted className="text-justify leading-5.5">
              {movie.overview}
            </Typography.Small>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
