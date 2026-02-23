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
          className="col-start-1 row-start-1 rounded-md border-none bg-white px-8 py-1.5 text-sm text-mist-900 shadow-xs ring-1 ring-mist-300 ring-inset placeholder:text-mist-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset dark:bg-mist-900 dark:text-white dark:ring-mist-800"
        />
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 ml-2 size-4 self-center text-mist-400"
        />
        {!!search.length && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-mist-400 transition hover:text-mist-500 dark:text-mist-400 dark:hover:text-mist-300"
          >
            <XMarkIcon className="size-4" />
          </button>
        )}
      </div>
    </Field>
  );
};
