import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { notFound, redirect, RedirectType } from "next/navigation";

import { getMovieListById } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { ListOptions } from "./ListOptions";
import { MovieList } from "./MovieList";

type ListPageProps = {
  params: Promise<{ id: string }>;
};

const ListPage = async ({ params }: ListPageProps) => {
  const { id } = await params;
  const { data: list, success } = await getMovieListById(id);

  if (!success) {
    return <ErrorMessage />;
  }

  if (!list) {
    notFound();
  }

  if (!list.owner && list.private) {
    redirect("/", RedirectType.replace);
  }

  const { title, owner, createdAt, user, movies } = list;

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Typography.H1 className="leading-8 hyphens-auto">
          {title}
        </Typography.H1>
        {!!owner && (
          <ListOptions
            listId={id}
            listTitle={title}
            listPrivate={list.private}
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <Typography.Small className="flex items-center gap-1.5 font-medium">
          <Avatar userImage={user.image} size="sm" />
          {user.name}
        </Typography.Small>
        <Typography.Small className="flex items-center gap-1.5" muted>
          <CalendarDaysIcon className="size-4" />
          {formatDate(createdAt)}
        </Typography.Small>
        <Typography.Small className="flex items-center gap-1.5" muted>
          {list.private ? (
            <>
              <EyeSlashIcon strokeWidth={2} className="size-4" />
              Visible only to you
            </>
          ) : (
            <>
              <EyeIcon strokeWidth={2} className="size-4" />
              Visible to everyone
            </>
          )}
        </Typography.Small>
      </div>
      <MovieList listId={id} movies={movies} owner={!!owner} />
    </div>
  );
};

export default ListPage;
