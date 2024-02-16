"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import { LoadingDots } from "@/app/components";
import { ListType } from "@/app/types";
import placeholder from "@/public/placeholder-1.svg";
import { ListCard } from ".";

const getMyLists = async () => {
  const res = await axios.get("/api/lists/get");
  return res.data.lists;
};

export const MyLists = () => {
  const { data, error, isPending } = useQuery<ListType[]>({
    queryKey: ["lists"],
    queryFn: getMyLists,
  });

  if (error) {
    return (
      <p className="font-semibold text-slate-700">
        Oops! Something went wrong...
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-8 w-fit text-5xl font-bold text-slate-700">
        My Movie Lists
      </h1>
      <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
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
