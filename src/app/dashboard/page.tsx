import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { ListSortSelect } from "@/components/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { Typography } from "@/components/ui/Typography";

type MyListsProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const getCachedUserMovieLists = async (
  userId: string,
  search?: string,
  sort?: string,
) => {
  "use cache";
  return await getUserMovieLists(userId, search, sort);
};

const MyLists = async ({ searchParams }: MyListsProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: lists, success } = await getCachedUserMovieLists(
    session.user.id,
    search,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <div className="flex flex-col gap-10">
      <Typography.H1>My movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <div className="flex w-full items-end justify-end gap-2">
          <SearchParamInput placeholder="List title" />
          <ListSortSelect />
        </div>
      </div>

      {search && (
        <Typography.Small className="mt-4 -mb-4 text-center" muted>
          Showing results for <strong>{`"${search}"`}</strong>
        </Typography.Small>
      )}

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

export default MyLists;
