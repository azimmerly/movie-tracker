import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { ListsTabContent } from "@/components/lists/ListsTabContent";

type MyListsProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const MyLists = async ({ searchParams }: MyListsProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <ListsTabContent
      userId={session.user.id}
      owner={true}
      search={search}
      sort={sort}
    />
  );
};

export default MyLists;
