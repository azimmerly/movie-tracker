import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getMovieListById } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { MOVIES_PAGE_SIZE } from "@/consts";
import { formatDate } from "@/utils/formatDate";
import { formatUserId } from "@/utils/formatUserId";
import { getOffset, handleInvalidPage, parsePage } from "@/utils/pagination";
import { ListOptions } from "./ListOptions";
import { MovieList } from "./MovieList";

const visibilityConfig = {
  private: {
    icon: EyeSlashIcon,
    label: "Private list",
  },
  public: {
    icon: EyeIcon,
    label: "Public list",
  },
} as const;

type ListPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const ListPage = async ({ params, searchParams }: ListPageProps) => {
  const { id } = await params;
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
  const offset = getOffset(currentPage, MOVIES_PAGE_SIZE);
  const [session, { data: list, success }] = await Promise.all([
    getSession(),
    getMovieListById(id, MOVIES_PAGE_SIZE, offset, search, sort),
  ]);

  if (!success) {
    return <ErrorMessage />;
  }

  if (!list) {
    notFound();
  }

  const { user, title, description, createdAt, movies, totalCount } = list;

  handleInvalidPage(currentPage, totalCount, MOVIES_PAGE_SIZE);

  const owner = session?.user.id === user.id;
  const userListsHref = owner ? "/dashboard/lists" : `/user/${user.id}/lists`;

  const { icon: VisibilityIcon, label: visibilityLabel } =
    visibilityConfig[list.private ? "private" : "public"];

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Typography.H1 className="leading-8 hyphens-auto">
            {title}
          </Typography.H1>
          {owner && <ListOptions list={list} />}
        </div>
        {description && (
          <Typography.Small
            muted
            className="max-w-2xl border-l-2 border-mist-300 pl-2 text-pretty italic dark:border-mist-600"
          >
            {description}
          </Typography.Small>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Typography.Small className="flex items-center gap-1.75 font-medium">
          <Avatar user={user} className="size-4.5" />
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
          <VisibilityIcon strokeWidth={2} className="size-4" />
          {visibilityLabel}
        </Typography.Small>
      </div>
      <MovieList
        listId={id}
        movies={movies}
        owner={owner}
        search={search}
        totalCount={totalCount}
        page={currentPage}
        pageSize={MOVIES_PAGE_SIZE}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default ListPage;
