import { CalendarDaysIcon as SmallCalendarDaysIcon } from "@heroicons/react/16/solid";
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  LanguageIcon,
} from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getMovie } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { Typography } from "@/components/ui/Typography";
import { IMDB_MOVIE_URL } from "@/consts";
import { formatDate } from "@/utils/formatDate";
import { formatLanguage } from "@/utils/formatLanguage";
import { formatRuntime } from "@/utils/formatRuntime";
import { getMovieImage } from "@/utils/getMovieImage";
import { MovieAvgRating } from "./MovieAvgRating";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { id } = await params;
  const { data: movie, success } = await getMovie(Number(id));

  if (!success) {
    return <ErrorMessage />;
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-8 lg:mt-16 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
      <Image
        priority
        width={320}
        height={480}
        alt={movie.title}
        draggable={false}
        src={getMovieImage(movie.posterPath, "lg")}
        className="h-84 w-56 rounded-lg shadow lg:h-120 lg:w-80 lg:shrink-0"
      />
      <div className="flex flex-col items-center gap-9 lg:max-w-lg lg:items-start">
        <div className="flex flex-col items-center gap-2.5 lg:items-start">
          <Typography.H1 className="max-w-2xl text-center lg:text-left">
            {movie.title}
          </Typography.H1>
          {!!movie.tagline && (
            <Typography.Small
              muted
              className="max-w-md text-center italic lg:text-left"
            >{`"${movie.tagline}"`}</Typography.Small>
          )}
          <div className="flex flex-wrap justify-center gap-1 lg:justify-start">
            {movie.status !== "Released" && (
              <Chip
                variant="secondary"
                text={movie.status}
                icon={SmallCalendarDaysIcon}
              />
            )}
            {movie.genres.slice(0, 3).map((genre) => (
              <Chip key={genre} text={genre} variant="primary" />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 lg:items-start">
          <div className="flex max-w-xl flex-wrap items-center justify-center gap-y-2 lg:justify-start">
            {!!movie.runtime && (
              <Tooltip
                label="Runtime"
                className="flex items-center before:mx-2 before:content-['·'] first:before:hidden"
              >
                <Typography.Small muted className="flex items-center gap-0.5">
                  <ClockIcon className="size-4" strokeWidth={2} />
                  {formatRuntime(movie.runtime)}
                </Typography.Small>
              </Tooltip>
            )}
            {!!movie.releaseDate && (
              <Tooltip
                label="Release date"
                className="flex items-center before:mx-2 before:content-['·'] first:before:hidden"
              >
                <Typography.Small muted className="flex items-center gap-0.75">
                  <CalendarDaysIcon className="size-4" />
                  {formatDate(movie.releaseDate)}
                </Typography.Small>
              </Tooltip>
            )}
            {!!movie.language && (
              <Tooltip
                label="Language"
                className="flex items-center before:mx-2 before:content-['·'] first:before:hidden"
              >
                <Typography.Small muted className="flex items-center gap-0.5">
                  <LanguageIcon className="size-4" />
                  {formatLanguage(movie.language)}
                </Typography.Small>
              </Tooltip>
            )}
          </div>
          <Suspense fallback={<Skeleton className="h-5 w-32" />}>
            <MovieAvgRating movieId={movie.id} />
          </Suspense>
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
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          {!!movie.directors?.length && (
            <div className="max-w-md">
              <Typography.Small className="font-semibold">
                Directed by
              </Typography.Small>
              <Typography.Small muted className="text-pretty">
                {movie.directors.join(", ")}
              </Typography.Small>
            </div>
          )}
          {!!movie.cast?.length && (
            <div className="max-w-md">
              <Typography.Small className="font-semibold">
                Cast
              </Typography.Small>
              <Typography.Small muted className="text-pretty">
                {movie.cast.join(", ")}
              </Typography.Small>
            </div>
          )}
          {!!movie.overview && (
            <div className="max-w-xl">
              <Typography.Small className="font-semibold">
                Overview
              </Typography.Small>
              <Typography.Small muted className="text-justify text-pretty">
                {movie.overview}
              </Typography.Small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
