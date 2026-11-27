"use client";

import { Button } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";
import { useQueryString } from "@/utils/useQueryString";

type ActiveFilterProps = {
  resource: string;
  value?: string;
  param?: string;
  className?: string;
};

export const ActiveFilter = ({
  resource,
  value,
  param = "search",
  className,
}: ActiveFilterProps) => {
  const { setQueryParams } = useQueryString();

  if (!value) {
    return null;
  }

  return (
    <div
      role="status"
      className={twMerge("mt-5 flex flex-wrap items-center gap-2", className)}
    >
      <Typography.Small muted>Showing {resource} matching</Typography.Small>
      <Button
        aria-label={`Clear "${value}"`}
        onClick={() => setQueryParams({ [param]: null, page: null })}
        className="group flex max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-md bg-mist-400/15 py-1 pr-1.5 pl-2.5 text-sm font-medium transition-colors hover:bg-mist-400/25 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
      >
        <span className="truncate">{value}</span>
        <XMarkIcon className="size-3.5 shrink-0 text-mist-400 transition-colors group-hover:text-mist-600 dark:group-hover:text-mist-300" />
      </Button>
    </div>
  );
};
