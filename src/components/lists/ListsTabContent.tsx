import { Squares2X2Icon } from "@heroicons/react/16/solid";

import { getUserMovieLists } from "@/actions/list";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AddListDialog } from "@/components/lists/AddListDialog";
import { ListCard } from "@/components/lists/ListCard";
import { ListSortSelect } from "@/components/lists/ListSortSelect";
import { NothingFound } from "@/components/NothingFound";
import { SearchParamInput } from "@/components/SearchParamInput";
import { SearchResultMessage } from "@/components/SearchResultMessage";
import { Typography } from "@/components/ui/Typography";

type ListsTabContentProps = {
  userId: string;
  owner: boolean;
  search?: string;
  sort?: string;
};

export const ListsTabContent = async ({
  userId,
  owner,
  search,
  sort,
}: ListsTabContentProps) => {
  const { data: lists, success } = await getUserMovieLists(
    userId,
    search,
    sort,
  );

  if (!success) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row">
        {owner ? (
          <AddListDialog />
        ) : (
          <div className="mb-2 flex w-full min-w-0 items-center gap-1">
            <Squares2X2Icon className="size-4 shrink-0 text-blue-600/70 dark:text-blue-500/70" />
            <Typography.Body muted className="truncate">
              This user&apos;s movie lists
            </Typography.Body>
          </div>
        )}
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-fit sm:flex-row">
          <SearchParamInput placeholder="List title" />
          <ListSortSelect />
        </div>
      </div>
      <SearchResultMessage searchTerm={search} noun="lists" />
      <div className="flex flex-col gap-2.5">
        {lists?.length ? (
          lists.map(({ user, movieCount, ...list }) => (
            <ListCard
              list={list}
              user={user}
              movieCount={movieCount}
              key={list.id}
            />
          ))
        ) : (
          <NothingFound
            text={
              owner
                ? "Create a list to get started."
                : "No movie lists here… yet."
            }
          />
        )}
      </div>
    </>
  );
};
