"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Select, type SelectOption } from "@/components/ui/Select";
import { useQueryString } from "@/utils/useQueryString";

const sortOptions = [
  { value: "added", label: "Date added" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Movie title" },
  { value: "released", label: "Release date" },
];

export const MovieSortSelect = () => {
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryString();
  const initialSort =
    sortOptions.find(({ value }) => value === searchParams.get("sort")) ??
    sortOptions[0];
  const [sortBy, setSortBy] = useState(initialSort);

  const handleUpdate = (option: SelectOption) => {
    if (option.value === sortBy.value) {
      return;
    }
    setSortBy(option);
    setQueryParams({ sort: option.value });
  };

  return (
    <Select
      label="Sort by"
      options={sortOptions}
      selected={sortBy}
      setSelected={handleUpdate}
      className="w-full self-start sm:w-40"
    />
  );
};
