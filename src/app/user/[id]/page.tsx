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
import { Typography } from "@/components/ui/Typography";

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
      <Typography.H1>Movie lists: {user.name}</Typography.H1>
      <div className="flex w-full items-end justify-end gap-2">
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
