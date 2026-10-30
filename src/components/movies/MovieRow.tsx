import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import { MovieActions } from "@/components/movies/MovieActions";
import { MoviePoster } from "@/components/movies/MoviePoster";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import { Typography } from "@/components/ui/Typography";
import type { Movie, UserMovie } from "@/types";
import { formatDate, formatYear } from "@/utils/formatDate";

type MovieRowProps = {
  movie: Movie;
  owner: boolean;
  options: React.ReactNode;
  priority?: boolean;
  children?: React.ReactNode;
} & Pick<UserMovie, "rating" | "favorite">;

export const MovieRow = ({
  movie,
  owner,
  rating,
  favorite,
  options,
  priority,
  children,
}: MovieRowProps) => (
  <li className="flex justify-between py-4">
    <div className="flex gap-4">
      <MoviePoster
        size="md"
        alt={movie.title}
        posterPath={movie.posterPath}
        href={`/movie/${movie.id}`}
        priority={priority}
      />
      <div>
        <span className="flex flex-wrap gap-x-3 gap-y-0.5">
          <Link href={`/movie/${movie.id}`}>
            <Typography.Body className="text-base font-semibold hover:underline">
              {movie.title}
            </Typography.Body>
          </Link>
          <Tooltip
            label={formatDate(movie.releaseDate)}
            className="self-center"
          >
            <Typography.Tiny muted className="flex items-center gap-0.5">
              <CalendarDaysIcon className="mb-px size-3.5" />
              {formatYear(movie.releaseDate)}
            </Typography.Tiny>
          </Tooltip>
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {movie.genres.slice(0, 3).map((genre) => (
            <Chip
              key={genre}
              text={genre}
              variant="primary"
              className="text-[11px] sm:text-xs"
            />
          ))}
        </div>
        <MovieActions
          owner={owner}
          movieId={movie.id}
          rating={rating}
          favorite={favorite}
        />
        {children}
      </div>
    </div>
    {options}
  </li>
);
