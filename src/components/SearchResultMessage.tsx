"use client";

import { Button } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";
import { useQueryString } from "@/utils/useQueryString";

type SearchResultMessageProps = {
  searchTerm: string;
  className?: ClassNameValue;
};

export const SearchResultMessage = ({
  searchTerm,
  className,
}: SearchResultMessageProps) => {
  const { setQueryParams } = useQueryString();

  return (
    <div
      className={twMerge(
        "mt-3 flex items-center justify-center gap-1",
        className,
      )}
    >
      <Typography.Small muted className="text-center">
        Showing results for <strong>{`"${searchTerm}"`}</strong>
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
