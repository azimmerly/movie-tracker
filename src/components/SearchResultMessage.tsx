"use client";

import { Button } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";
import { useQueryString } from "@/utils/useQueryString";

type SearchResultMessageProps = {
  noun: string;
  searchTerm?: string;
  className?: string;
};

export const SearchResultMessage = ({
  noun,
  searchTerm,
  className,
}: SearchResultMessageProps) => {
  const { setQueryParams } = useQueryString();

  if (!searchTerm) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "mt-5 flex items-center justify-center gap-1",
        className,
      )}
    >
      <Typography.Small muted className="text-center">
        Showing {noun} matching <strong>{`"${searchTerm}"`}</strong>
      </Typography.Small>
      <Button
        onClick={() => setQueryParams({ search: null, page: null })}
        className="cursor-pointer rounded p-0.5 text-mist-400 transition hover:text-mist-500 dark:text-mist-500 dark:hover:text-mist-400"
      >
        <XCircleIcon className="size-3.5" />
      </Button>
    </div>
  );
};
