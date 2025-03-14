"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Select, type SelectOption } from "@/components/ui/Select";
import { useUpdateQueryString } from "@/utils/useUpdateQueryString";

const filterOptions = [
  { value: "all", label: "All lists" },
  { value: "non-empty", label: "Lists with movies" },
];

export const ListFilterSelect = () => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const initialFilter =
    filterOptions.find(({ value }) => value === searchParams.get("filter")) ??
    filterOptions[0];
  const [filterBy, setFilterBy] = useState(initialFilter);

  const handleUpdate = (option: SelectOption) => {
    setFilterBy(option);
    updateQueryString("filter", option.value);
  };

  return (
    <Select
      label="Filter by"
      options={filterOptions}
      selected={filterBy}
      setSelected={handleUpdate}
      icon={AdjustmentsHorizontalIcon}
      className="w-full self-start sm:w-44"
    />
  );
};
