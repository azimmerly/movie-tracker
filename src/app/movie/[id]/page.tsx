import { ArrowTopRightOnSquareIcon, StarIcon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getMovieInfo } from "@/actions/movie";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import { IMDB_MOVIE_URL } from "@/consts";
import { MovieInfoWithRating } from "@/types";
import { formatRuntime } from "@/utils/formatRuntime";
import { getMovieImage } from "@/utils/getMovieImage";

type MoviePageProps = {
  params: Promise<{ id: number }>;
};

const getCachedMovieInfo = async (id: number) => {
  "use cache";
  return await getMovieInfo(id);
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { id } = await params;
  const { data, success } = await getCachedMovieInfo(id);
  const movie = data as MovieInfoWithRating;

  if (!success) {
    return <ErrorMessage />;
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-7 sm:mt-16">
      <Image
        priority
        width={240}
        height={360}
        alt={movie.title}
        draggable={false}
        src={getMovieImage(movie.imagePath, "lg")}
        className="h-[240px] w-40 rounded-md shadow sm:h-[360px] sm:w-60"
      />
      <div className="flex flex-col items-center gap-2">
        <Typography.H2>{movie.title}</Typography.H2>
        {movie.tagline && (
          <Typography.Small
            muted
            className="max-w-md text-center"
          >{`"${movie.tagline}"`}</Typography.Small>
        )}
      </div>
      <div className="flex flex-col items-center gap-3">
        {movie.avgRating && (
          <Typography.Small className="flex items-center gap-1">
            <StarIcon className="mb-px size-4.5 fill-amber-400 dark:fill-amber-500" />
            <strong className="font-semibold">{movie.avgRating}</strong> average
            user rating
          </Typography.Small>
        )}
        <div className="flex flex-wrap gap-1">
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
          {movie.runtime && (
            <Typography.Small muted className="flex items-center gap-1">
              <ClockIcon className="size-4" strokeWidth={2} />
              {formatRuntime(movie.runtime)}
            </Typography.Small>
          )}
          {movie.year && (
            <Typography.Small muted className="flex items-center gap-1">
              <CalendarDaysIcon className="size-4" />
              {movie.year}
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
      {movie.description && (
        <Typography.Small className="max-w-xl border-l-2 border-blue-500/60 px-2 text-justify">
          {movie.description}
        </Typography.Small>
      )}
    </div>
  );
};

export default MoviePage;
