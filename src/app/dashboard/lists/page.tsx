import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { ListsTabContent } from "@/components/lists/ListsTabContent";
import { parsePage } from "@/utils/pagination";

type MyListsProps = {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const MyLists = async ({ searchParams }: MyListsProps) => {
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
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
      page={currentPage}
    />
  );
};

export default MyLists;
