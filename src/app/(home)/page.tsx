import { getSession } from "@/actions/auth";
import { getAllMovieLists } from "@/actions/list";
import { AddListDialog } from "@/components/AddListDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ListCard } from "@/components/ListCard";
import { ListSortSelect } from "@/components/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";
import { LIST_PAGE_SIZE } from "@/consts";

type HomeProps = {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const Home = async ({ searchParams }: HomeProps) => {
  const { search, sort, page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const offset = LIST_PAGE_SIZE * (currentPage - 1);

  const session = await getSession();
  const {
    data: lists,
    totalCount,
    success,
  } = await getAllMovieLists(LIST_PAGE_SIZE, search, sort, offset);

  if (!success || !lists) {
    return <ErrorMessage />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>All movie lists</Typography.H1>
      <div className="flex flex-col-reverse items-end justify-between gap-3 sm:flex-row">
        <AddListDialog session={session?.session} />
        <div className="flex w-full items-end justify-end gap-2">
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

      {totalCount > LIST_PAGE_SIZE && (
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={LIST_PAGE_SIZE}
          itemLabel="movie lists"
        />
      )}
    </div>
  );
};

export default Home;
