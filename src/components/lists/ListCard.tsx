import {
  CalendarDaysIcon,
  EyeSlashIcon,
  FilmIcon,
} from "@heroicons/react/16/solid";
import type { User } from "better-auth";
import Image from "next/image";
import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { MovieList } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getMovieImage } from "@/utils/getMovieImage";

const TICKET_NOTCHES =
  "[mask-composite:intersect] [mask-image:radial-gradient(circle_10px_at_0_50%,#0000_97%,#000),radial-gradient(circle_10px_at_100%_50%,#0000_97%,#000)]";

const PosterStack = ({ paths }: { paths: string[] }) => {
  if (!paths.length) {
    return (
      <div
        aria-hidden="true"
        className="hidden h-16 w-11 shrink-0 items-center justify-center rounded-md border-2 border-dashed border-mist-200 text-mist-200 sm:flex dark:border-mist-700/60 dark:text-mist-700/60"
      >
        <FilmIcon className="size-4" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center -space-x-3 sm:flex"
    >
      {paths.map((path, index) => (
        <Image
          key={path}
          src={getMovieImage(path, "sm")}
          alt=""
          width={44}
          height={64}
          unoptimized
          draggable={false}
          style={{ zIndex: paths.length - index }}
          className="relative h-16 w-11 rounded-md object-cover shadow-sm ring-2 ring-white dark:ring-mist-900"
        />
      ))}
    </div>
  );
};

type ListCardProps = {
  list: Omit<MovieList, "userId" | "updatedAt">;
  user: Pick<User, "name" | "image">;
  movieCount: number;
  posterPaths: string[];
};

export const ListCard = ({
  list: { id, title, description, createdAt, private: isPrivate },
  user,
  movieCount,
  posterPaths,
}: ListCardProps) => (
  <Link
    href={`/list/${id}`}
    className="block drop-shadow-sm transition ease-out will-change-transform backface-hidden hover:-translate-y-px hover:scale-[1.005] hover:drop-shadow-md"
  >
    <div
      className={`overflow-hidden rounded-lg bg-white ring-1 ring-transparent ring-inset dark:bg-mist-900 dark:ring-mist-800 ${TICKET_NOTCHES}`}
    >
      <div className="flex items-center justify-between gap-6 px-7 pt-5 pb-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Typography.Large className="truncate leading-5 font-bold">
            {title}
          </Typography.Large>
          {description && (
            <Typography.Tiny muted className="truncate italic">
              {description}
            </Typography.Tiny>
          )}
        </div>
        <PosterStack paths={posterPaths} />
      </div>
      <div className="mx-5 border-t-2 border-dashed border-mist-200 dark:border-mist-700/60" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-7 pt-3 pb-4 sm:flex sm:gap-4">
        <Typography.Tiny
          muted
          className="col-start-1 flex min-w-0 items-center gap-1.25"
        >
          <Avatar user={user} className="size-3.5 shrink-0" />
          <span className="truncate">{user.name}</span>
        </Typography.Tiny>
        <Typography.Tiny
          muted
          className="col-start-1 flex shrink-0 items-center gap-1"
        >
          <CalendarDaysIcon className="size-3.5" />
          {formatDate(createdAt)}
        </Typography.Tiny>
        <div className="col-start-2 row-span-2 row-start-1 flex shrink-0 items-center gap-1.25 sm:ml-auto">
          {isPrivate && (
            <Chip variant="secondary" icon={EyeSlashIcon} text="Private" />
          )}
          <Chip
            variant="primary"
            text={`${movieCount} ${movieCount === 1 ? "movie" : "movies"}`}
            className="whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  </Link>
);
