"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Select, type SelectOption } from "@/components/ui/Select";
import { useUpdateQueryString } from "@/utils/useUpdateQueryString";

const sortOptions = [
  { value: "date", label: "Date added" },
  { value: "title", label: "List title" },
];

export const ListSortSelect = () => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const initialSort =
    sortOptions.find(({ value }) => value === searchParams.get("sort")) ??
    sortOptions[0];
  const [sortBy, setSortBy] = useState(initialSort);

  const handleUpdate = (option: SelectOption) => {
    setSortBy(option);
    updateQueryString("sort", option.value);
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
