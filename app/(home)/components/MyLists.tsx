"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { ErrorMessage, LoadingDots } from "@/app/components";
import { ListType } from "@/app/types";
import placeholder from "@/public/placeholder-1.svg";
import { ListCard } from ".";

export const MyLists = () => {
  const { data, error, isPending } = useQuery<ListType[]>({
    queryKey: ["lists"],
    queryFn: () => fetch("/api/lists/get").then((res) => res.json()),
  });

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div>
      <h1 className="mb-6 w-fit text-3xl font-bold text-slate-700 sm:text-4xl">
        My Movie Lists
      </h1>
      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        {isPending ? (
          <LoadingDots className="mt-12 flex w-full justify-center" />
        ) : (
          data.map((list) => <ListCard key={list.id} list={list} />)
        )}
        {!isPending && !data.length && (
          <div className="my-16 flex w-full flex-col items-center justify-center gap-8">
            <p className="font-semibold text-slate-600">
              Create a list to get started!
            </p>
            <Image
              priority
              src={placeholder}
              alt="create a list"
              className="h-full max-h-72 w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};
