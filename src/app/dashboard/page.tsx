import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserMovieLists } from "@/actions/list";
import ticketImage from "@/assets/ticket.png";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { Typography } from "@/components/ui/Typography";
import { ListSortSelect } from "./ListSortSelect";

type MyListsProps = {
  searchParams: Promise<{ sort?: string }>;
};

const getCachedUserMovieLists = async (userId: string, sort?: string) => {
  "use cache";
  return await getUserMovieLists(userId, sort);
};

const MyLists = async ({ searchParams }: MyListsProps) => {
  const { sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: lists, success } = await getCachedUserMovieLists(
    session.user.id,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <Typography.H1 className="mb-6">My movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <ListSortSelect />
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {lists?.length ? (
          lists.map((list) => (
            <ListCard {...list} key={list.id} movieCount={list.movies.length} />
          ))
        ) : (
          <div className="mt-28 text-center">
            <Image
              priority
              draggable={false}
              src={ticketImage}
              alt="movie ticket"
              className="mx-auto size-20"
            />
            <Typography.Body muted className="font-medium">
              Create a list to get started!
            </Typography.Body>
          </div>
        )}
      </div>
    </>
  );
};

export default MyLists;
