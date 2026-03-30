import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { ListsTabContent } from "@/components/lists/ListsTabContent";

type UserListsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const UserLists = async ({ params, searchParams }: UserListsProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/lists");
  }

  return (
    <ListsTabContent userId={id} owner={false} search={search} sort={sort} />
  );
};

export default UserLists;
