import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { notFound, redirect, RedirectType } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getMovieListById } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { ListOptions } from "./ListOptions";
import { MovieList } from "./MovieList";

type ListPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const getCachedMovieListById = async (
  id: string,
  search?: string,
  sort?: string,
) => {
  "use cache";
  return await getMovieListById(id, search, sort);
};

const ListPage = async ({ params, searchParams }: ListPageProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();
  const { data: list, success } = await getCachedMovieListById(
    id,
    search,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  if (!list) {
    notFound();
  }

  const { user, private: isPrivate, title, createdAt, movies } = list;
  const owner = session?.user.id === user.id;

  if (!owner && isPrivate) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Typography.H1 className="leading-8 hyphens-auto">
          {title}
        </Typography.H1>
        {owner && <ListOptions id={id} title={title} isPrivate={isPrivate} />}
      </div>
      <div className="flex flex-col gap-0.5">
        <Typography.Small className="flex items-center gap-1.5 font-medium">
          <Avatar userImage={user.image} size="sm" />
          <Typography.Link href={owner ? "/dashboard" : `/user/${user.id}`}>
            {user.name}
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
