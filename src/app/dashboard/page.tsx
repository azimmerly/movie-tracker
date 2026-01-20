import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { ListSortSelect } from "@/components/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";

type MyListsProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const MyLists = async ({ searchParams }: MyListsProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: lists, success } = await getUserMovieLists(
    session.user.id,
    search,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>My movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <div className="flex w-full flex-col items-end justify-end gap-2 sm:flex-row">
          <SearchParamInput placeholder="List title" />
          <ListSortSelect />
        </div>
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

export default MyLists;
