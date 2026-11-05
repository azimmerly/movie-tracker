import {
  CalendarDaysIcon,
  EyeSlashIcon,
  FilmIcon,
} from "@heroicons/react/16/solid";
import type { User } from "better-auth";
import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { MovieList } from "@/types";
import { formatDate } from "@/utils/formatDate";

type ListCardProps = {
  list: Omit<MovieList, "userId" | "updatedAt">;
  user: Pick<User, "name" | "image">;
  movieCount: number;
};

export const ListCard = ({
  list: { id, title, description, createdAt, private: isPrivate },
  user,
  movieCount,
}: ListCardProps) => (
  <Link href={`/list/${id}`}>
    <Card className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 transition-transform ease-out will-change-transform backface-hidden hover:-translate-y-px hover:scale-[1.005] hover:shadow-md">
      <div className="col-span-2 mb-4 flex min-w-0 flex-col gap-2 sm:col-span-1">
        <Typography.Large className="leading-5 font-bold">
          {title}
        </Typography.Large>
        {description && (
          <Typography.Tiny muted className="truncate pe-1 italic">
            {description}
          </Typography.Tiny>
        )}
      </div>
      <div className="col-start-2 row-start-3 flex shrink-0 gap-1.25 self-end sm:row-start-1 sm:self-start">
        {isPrivate && (
          <Chip variant="secondary" icon={EyeSlashIcon} text="Private" />
        )}
        <Chip
          variant="primary"
          icon={FilmIcon}
          text={`${movieCount} ${movieCount === 1 ? "movie" : "movies"}`}
          className="whitespace-nowrap"
        />
      </div>
      <Typography.Tiny
        muted
        className="col-span-2 mb-0 flex items-center gap-1.25 sm:mb-1.5"
      >
        <Avatar user={user} className="size-3.5" />
        {user.name}
      </Typography.Tiny>
      <Typography.Tiny className="flex items-start gap-1.25 self-end" muted>
        <CalendarDaysIcon className="size-3.5" />
        {formatDate(createdAt)}
      </Typography.Tiny>
    </Card>
  </Link>
);
