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
        "mt-2 -mb-4 flex items-center justify-center gap-2",
        className,
      )}
    >
      <Typography.Small muted className="text-center">
        Showing results for <strong>{`"${searchTerm}"`}</strong>
      </Typography.Small>
      <Button
        size="xs"
        variant="secondary"
        className="rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100"
        icon={XCircleIcon}
        onClick={handleClick}
      >
        Clear
      </Button>
    </div>
  );
};
