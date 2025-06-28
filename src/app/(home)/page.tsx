import { getSession } from "@/actions/auth";
import { getAllMovieLists } from "@/actions/list";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { ListSearchInput } from "@/components/ListSearchInput";
import { ListSortSelect } from "@/components/ListSortSelect";
import { NoListsMessage } from "@/components/NoListsMessage";
import { Typography } from "@/components/ui/Typography";

type HomeProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const getCachedAllMovieLists = async (search?: string, sort?: string) => {
  "use cache";
  return await getAllMovieLists(search, sort);
};

const Home = async ({ searchParams }: HomeProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();
  const { data: lists, success } = await getCachedAllMovieLists(search, sort);

  if (!success || !lists) {
    return <ErrorMessage />;
  }

  return (
    <div className="flex flex-col gap-10">
      <Typography.H1>All movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <div className="flex w-full items-end justify-end gap-2">
          <ListSearchInput />
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
          <NoListsMessage />
        )}
      </div>
    </div>
  );
};

export default Home;
