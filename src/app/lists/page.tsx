import { getSession } from "@/actions/auth";
import { getAllMovieLists } from "@/actions/list";
import { ActiveFilter } from "@/components/ActiveFilter";
import { AuthPrompt } from "@/components/AuthPrompt";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AddListDialog } from "@/components/lists/AddListDialog";
import { ListCard } from "@/components/lists/ListCard";
import { ListSortSelect } from "@/components/lists/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Typography } from "@/components/ui/Typography";
import { LISTS_PAGE_SIZE } from "@/consts";
import { getOffset, handleInvalidPage, parsePage } from "@/utils/pagination";

type ListsPageProps = {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const ListsPage = async ({ searchParams }: ListsPageProps) => {
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
  const offset = getOffset(currentPage, LISTS_PAGE_SIZE);

  const [session, { data, success }] = await Promise.all([
    getSession(),
    getAllMovieLists(LISTS_PAGE_SIZE, offset, search, sort),
  ]);

  if (!success || !data) {
    return <ErrorMessage />;
  }

  const { lists, totalCount } = data;

  handleInvalidPage(currentPage, totalCount, LISTS_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-col gap-2">
        <Typography.H1>Browse movie lists</Typography.H1>
        <Typography.Body muted>
          Discover lists from other movie fans, or create your own.
        </Typography.Body>
      </div>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        {!!session ? (
          <AddListDialog />
        ) : (
          <AuthPrompt action="create your own list" className="mb-2 w-full" />
        )}
        <div className="flex w-full flex-col items-end justify-end gap-2.25 sm:flex-row">
          <SearchInput placeholder="List title or username" />
          <ListSortSelect />
        </div>
      </div>
      <ActiveFilter value={search} resource="lists" />
      <div className="flex flex-col gap-3">
        {!!lists?.length ? (
          lists.map(({ user, movieCount, posterPaths, ...list }) => (
            <ListCard
              list={list}
              user={user}
              movieCount={movieCount}
              posterPaths={posterPaths}
              key={list.id}
            />
          ))
        ) : (
          <NothingFound text="No lists yet." />
        )}
      </div>
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={LISTS_PAGE_SIZE}
        itemLabel="movie lists"
      />
    </div>
  );
};

export default ListsPage;
