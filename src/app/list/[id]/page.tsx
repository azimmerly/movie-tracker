import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getMovieListById } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { formatUserId } from "@/utils/formatUserId";
import { ListOptions } from "./ListOptions";
import { MovieList } from "./MovieList";

type ListPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const ListPage = async ({ params, searchParams }: ListPageProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const [session, { data: list, success }] = await Promise.all([
    getSession(),
    getMovieListById(id, search, sort),
  ]);

  if (!success) {
    return <ErrorMessage />;
  }

  if (!list) {
    notFound();
  }

  const { user, private: isPrivate, title, createdAt, movies } = list;
  const owner = session?.user.id === user.id;
  const userListsHref = owner ? "/dashboard/lists" : `/user/${user.id}/lists`;

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Typography.H1 className="leading-8 hyphens-auto">
          {title}
        </Typography.H1>
        {owner && <ListOptions id={id} title={title} isPrivate={isPrivate} />}
      </div>
      <div className="flex flex-col gap-0.5">
        <Typography.Small className="flex items-center gap-1.75 font-medium">
          <Avatar userImage={user.image} className="size-4.5" />
          <Typography.Link
            className="flex gap-1.25 text-base"
            href={userListsHref as Route}
          >
            <span>{user.name}</span>
            <span className="font-normal opacity-80">
              {formatUserId(user.id)}
            </span>
          </Typography.Link>
        </Typography.Small>
        <Typography.Small className="flex items-center gap-1.5" muted>
          <CalendarDaysIcon className="size-4" />
          {formatDate(createdAt)}
        </Typography.Small>
        <Typography.Small className="flex items-center gap-1.5" muted>
          {isPrivate ? (
            <>
              <EyeSlashIcon strokeWidth={2} className="size-4" />
              Private list
            </>
          ) : (
            <>
              <EyeIcon strokeWidth={2} className="size-4" />
              Public list
            </>
          )}
        </Typography.Small>
      </div>
      <MovieList listId={id} movies={movies} owner={owner} />
    </div>
  );
};

export default ListPage;
