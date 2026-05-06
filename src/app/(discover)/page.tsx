import { notFound } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getAllMovieLists } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AddListDialog } from "@/components/lists/AddListDialog";
import { ListCard } from "@/components/lists/ListCard";
import { ListSortSelect } from "@/components/lists/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { Pagination } from "@/components/Pagination";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";
import { GetStartedButton } from "./GetStartedButton";

type DiscoverProps = {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const DISCOVER_PAGE_SIZE = 10;

const Discover = async ({ searchParams }: DiscoverProps) => {
  const { search, sort, page = "1" } = await searchParams;
  const currentPage = parseInt(page) || 1;
  const offset = DISCOVER_PAGE_SIZE * (currentPage - 1);

  const [session, { data, success }] = await Promise.all([
    getSession(),
    getAllMovieLists(DISCOVER_PAGE_SIZE, offset, search, sort),
  ]);

  if (!success || !data) {
    return <ErrorMessage />;
  }

  const { lists, totalCount } = data;

  if (
    totalCount > 0 &&
    currentPage > Math.ceil(totalCount / DISCOVER_PAGE_SIZE)
  ) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>Discover movie lists</Typography.H1>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        {!!session ? <AddListDialog /> : <GetStartedButton />}
        <div className="flex w-full flex-col items-end justify-end gap-2 sm:flex-row">
          <SearchParamInput placeholder="List title or username" />
          <ListSortSelect />
        </div>
      </div>
      <SearchResultMessage searchTerm={search} noun="lists" />
      <div className="flex flex-col gap-2.5">
        {!!lists?.length ? (
          lists.map(({ user, movieCount, ...list }) => (
            <ListCard
              list={list}
              user={user}
              movieCount={movieCount}
              key={list.id}
            />
          ))
        ) : (
          <NothingFound text="No movie lists here… yet." />
        )}
      </div>
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={DISCOVER_PAGE_SIZE}
        itemLabel="movie lists"
      />
    </div>
  );
};

export default Discover;
