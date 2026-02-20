import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { notFound, redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import { getUserById } from "@/actions/user";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { ListSortSelect } from "@/components/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { formatUserId } from "@/utils/formatUserId";

type MyListsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const UserLists = async ({ searchParams, params }: MyListsProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard");
  }

  const { data: user, success: userSuccess } = await getUserById(id);
  if (!user || !userSuccess) {
    notFound();
  }

  const { data: lists, success } = await getUserMovieLists(id, search, sort);
  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>Movie lists</Typography.H1>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <Avatar userImage={user.image} size="md" />
          <div className="flex gap-1">
            <Typography.Large>{user.name}</Typography.Large>
            <Typography.Body muted className="font-normal">
              {formatUserId(user.id)}
            </Typography.Body>
          </div>
        </div>
        <Typography.Small className="flex items-center gap-1.5" muted>
          <CalendarDaysIcon className="size-4" />
          <span className="font-medium">Joined: </span>
          {formatDate(user.createdAt)}
        </Typography.Small>
      </div>
      <div className="flex w-full flex-col items-end justify-end gap-2 sm:flex-row">
        <SearchParamInput placeholder="List title" />
        <ListSortSelect />
      </div>

      {search && <SearchResultMessage searchTerm={search} />}

      <div className="flex flex-col gap-2.5">
        {lists?.length ? (
          lists.map((list) => <ListCard {...list} key={list.id} />)
        ) : (
          <NothingFound text="No movie lists here… yet." />
        )}
      </div>
    </div>
  );
};

export default UserLists;
