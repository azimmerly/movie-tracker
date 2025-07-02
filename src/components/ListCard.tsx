import { FilmIcon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
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
    <Card className="relative transform-gpu transition will-change-transform backface-hidden hover:scale-[1.005] hover:shadow-md">
      <Typography.Large className="mb-1 leading-5 font-bold sm:mb-3">
        {title}
      </Typography.Large>
      <div className="top-2.5 right-2.5 mt-2 mb-4 flex flex-row gap-1 sm:absolute sm:mt-0 sm:flex-row-reverse">
        <Chip
          variant="primary"
          text={
            <span className="flex items-center gap-1">
              <FilmIcon className="size-3.5" />
              {movieCount} {movieCount === 1 ? "movie" : "movies"}
            </span>
          }
          className="self-end font-semibold whitespace-nowrap"
        />
        {isPrivate && (
          <Chip
            variant="secondary"
            text={
              <span className="flex items-center gap-1">
                <EyeSlashIcon className="size-3.5" />
                Private
              </span>
            }
          />
        )}
      </div>
      <Typography.Tiny muted className="mb-1 flex items-center gap-1">
        <Avatar userImage={user.image} size="xs" />
        {user.name}
      </Typography.Tiny>
      <Typography.Tiny className="flex items-start gap-1" muted>
        <CalendarDaysIcon className="size-3.5" />
        {formatDate(createdAt)}
      </Typography.Tiny>
    </Card>
  </Link>
);
