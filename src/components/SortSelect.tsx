"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Select, type SelectOption } from "@/components/ui/Select";
import { useQueryString } from "@/utils/useQueryString";

type SortSelectProps = {
  sortOptions: readonly SelectOption[];
};

export const SortSelect = ({ sortOptions }: SortSelectProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryString();
  const sortBy =
    sortOptions.find(({ value }) => value === searchParams.get("sort")) ??
    sortOptions[0];

  const handleUpdate = (option: SelectOption) => {
    if (option.value === sortBy.value) {
      return;
    }
    setQueryParams({ sort: option.value });
  };

  return (
    <Select
      key={pathname}
      label="Sort by"
      options={sortOptions}
      selected={sortBy}
      setSelected={handleUpdate}
      className="w-full self-start sm:w-40"
    />
  );
};
