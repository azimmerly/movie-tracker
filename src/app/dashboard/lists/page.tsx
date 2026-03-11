import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AddListDialog } from "@/components/lists/AddListDialog";
import { ListCard } from "@/components/lists/ListCard";
import { ListSortSelect } from "@/components/lists/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";

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
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session.session} />
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
          <NothingFound text="Create a list to get started." />
        )}
      </div>
    </>
  );
};

export default MyLists;
