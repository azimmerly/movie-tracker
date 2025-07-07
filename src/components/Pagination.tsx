"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useQueryString } from "@/utils/useQueryString";

type PaginationProps = {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  itemLabel: string;
};

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  itemLabel,
}: PaginationProps) => {
  const { setQueryParams } = useQueryString();

  const { totalPages, startItem, endItem } = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);
    return { totalPages, startItem, endItem };
  }, [currentPage, pageSize, totalCount]);

  const setPage = (page: number) => {
    setQueryParams({ page: page.toString() });
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700"
    >
      <Typography.Small muted className="hidden sm:block">
        Showing <span className="font-semibold">{startItem}</span> to
        <span className="font-semibold"> {endItem} </span> of
        <span className="font-semibold"> {totalCount}</span> {itemLabel}
      </Typography.Small>
      <div className="flex flex-1 justify-between gap-3 sm:justify-end">
        <Button
          variant="secondary"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
};
