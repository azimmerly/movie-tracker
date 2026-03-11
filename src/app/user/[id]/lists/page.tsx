import { Squares2X2Icon } from "@heroicons/react/16/solid";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/lists/ListCard";
import { ListSortSelect } from "@/components/lists/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";

type UserListsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const UserLists = async ({ searchParams, params }: UserListsProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/lists");
  }

  const { data: lists, success } = await getUserMovieLists(id, search, sort);

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <div className="mb-2 flex w-full min-w-0 items-center gap-1">
          <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
          <Typography.Body muted className="truncate">
            This user&apos;s movie lists
          </Typography.Body>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-fit sm:flex-row">
          <SearchParamInput placeholder="List title" />
          <ListSortSelect />
        </div>
      </div>

      {search && <SearchResultMessage searchTerm={search} />}

      <div className="flex flex-col gap-2.5">
        {!!lists?.length ? (
          lists.map((list) => <ListCard {...list} key={list.id} />)
        ) : (
          <NothingFound text="No movie lists here… yet." />
        )}
      </div>
    </>
  );
};

export default UserLists;
