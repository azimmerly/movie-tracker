import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { ListsTabContent } from "@/components/lists/ListsTabContent";
import { parsePage } from "@/utils/pagination";

type UserListsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const UserLists = async ({ params, searchParams }: UserListsProps) => {
  const { id } = await params;
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/lists");
  }

  return (
    <ListsTabContent
      userId={id}
      owner={false}
      search={search}
      sort={sort}
      page={currentPage}
    />
  );
};

export default UserLists;
