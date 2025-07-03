"use client";

import { XCircleIcon } from "@heroicons/react/16/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/Button";
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
  const { clearQueryParam } = useQueryString();

  const handleClick = () => {
    clearQueryParam("search");
  };

  return (
    <div
      className={twMerge(
        "mt-2 -mb-2 flex flex-col items-center justify-center gap-2 sm:flex-row",
        className,
      )}
    >
      <Typography.Small muted className="text-center">
        Showing results for <strong>{`"${searchTerm}"`}</strong>
      </Typography.Small>
      <Button
        size="xs"
        variant="secondary"
        className="rounded-full text-gray-600 dark:text-gray-200"
        icon={XCircleIcon}
        onClick={handleClick}
      >
        Clear
      </Button>
    </div>
  );
};
