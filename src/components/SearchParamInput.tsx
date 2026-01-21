"use client";

import { Field, Input, Label } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";

import { Typography } from "@/components/ui/Typography";
import { useDebouncedCallback } from "@/utils/useDebouncedCallback";
import { useQueryString } from "@/utils/useQueryString";

type SearchParamInputProps = {
  placeholder: string;
};

export const SearchParamInput = ({ placeholder }: SearchParamInputProps) => {
  const searchParams = useSearchParams();
  const { setQueryParams, clearQueryParam } = useQueryString();
  const searchParam = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  const debouncedUpdateQueryString = useDebouncedCallback((value: string) => {
    setQueryParams({ search: value, page: null });
  }, 500);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedUpdateQueryString(value);
  };

  const clearSearch = () => {
    setSearch("");
    clearQueryParam("search");
  };

  return (
    <Field className="flex w-full flex-col gap-0.5 sm:max-w-56">
      <Label className="hidden sm:block">
        <Typography.Tiny muted>Search</Typography.Tiny>
      </Label>
      <div className="relative grid grid-cols-1">
        <Input
          maxLength={25}
          value={search}
          onChange={handleSearch}
          autoComplete="off"
          placeholder={placeholder}
          className="col-start-1 row-start-1 rounded-md border-none bg-white px-8 py-1.5 text-sm text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset dark:bg-gray-800/70 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500"
        />
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 ml-2 size-4 self-center text-gray-400"
        />
        {!!search.length && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-gray-400 transition hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XMarkIcon className="size-4" />
          </button>
        )}
      </div>
    </Field>
  );
};
