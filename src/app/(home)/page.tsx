import { getSession } from "@/actions/auth";
import { getAllMovieLists } from "@/actions/list";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { Typography } from "@/components/ui/Typography";
import { ListFilterSelect } from "./ListFilterSelect";

type HomeProps = {
  searchParams: Promise<{ filter?: string }>;
};

const Home = async ({ searchParams }: HomeProps) => {
  const { filter } = await searchParams;
  const session = await getSession();
  const { data: lists, success } = await getAllMovieLists(filter);

  if (!success || !lists) {
    return <ErrorMessage />;
  }

  return (
    <>
      <Typography.H1 className="mb-6">Latest movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <ListFilterSelect />
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {lists?.map((list) => (
          <ListCard {...list} key={list.id} movieCount={list.movies.length} />
        ))}
      </div>
    </>
  );
};

export default Home;
