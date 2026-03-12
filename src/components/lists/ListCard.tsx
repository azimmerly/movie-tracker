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
  user: Pick<User, "name" | "image">;
  movieCount: number;
  private?: MovieList["private"];
} & Pick<MovieList, "id" | "title" | "createdAt">;

export const ListCard = ({
  id,
  title,
  createdAt,
  user,
  movieCount,
  private: isPrivate,
}: ListCardProps) => (
  <Link href={`/list/${id}`}>
    <Card className="transition-transform ease-out will-change-transform backface-hidden hover:-translate-y-px hover:scale-[1.005] hover:shadow-md">
      <div className="xs:flex-row xs:items-start xs:justify-between mb-3 flex flex-col gap-2">
        <Typography.Large className="leading-5 font-bold">
          {title}
        </Typography.Large>
        <div className="flex shrink-0 gap-1">
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
      </div>
      <Typography.Tiny muted className="mb-1.25 flex items-center gap-1.25">
        <Avatar userImage={user.image} className="size-3.5" />
        {user.name}
      </Typography.Tiny>
      <Typography.Tiny className="flex items-start gap-1.25" muted>
        <CalendarDaysIcon className="size-3.5" />
        {formatDate(createdAt)}
      </Typography.Tiny>
    </Card>
  </Link>
);
