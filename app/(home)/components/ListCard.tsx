"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight, FaTrashCan } from "react-icons/fa6";

import { deleteList } from "@/app/actions/lists";
import type { ListType } from "@/app/types";
import placeholder from "@/public/placeholder-1.svg";

type ListCardProps = {
  list: ListType;
};

export const ListCard = ({ list }: ListCardProps) => {
  const { id, title, movies } = list;
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState(false);

  const getMovieCountText = (length: number) => {
    return `${length} ${length === 1 ? "movie" : "movies"}`;
  };

  const { mutate } = useMutation({
    mutationFn: deleteList,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["lists"] });
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleClick = () => {
    setIsDisabled(true);
    mutate({ listId: id });
  };

  return (
    <div className="min-h-[300px] w-80 rounded-lg bg-white p-4 shadow">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-2">
          {movies.length ? (
            movies
              .slice(0, 3)
              .map(({ id, title, image }) => (
                <Image
                  src={`https://image.tmdb.org/t/p/w154${image}`}
                  key={id}
                  alt={title}
                  width={80}
                  height={120}
                  className="w-20 rounded shadow"
                />
              ))
          ) : (
            <Image
              src={placeholder}
              alt="movie list"
              className="m-auto h-[120px]"
            />
          )}
        </div>
        <p className="mt-3 break-all text-lg font-bold text-slate-700">
          {title}
        </p>
        <div className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
          {getMovieCountText(movies.length)}
        </div>
      </div>
      <div className="mt-7 flex gap-2">
        <Link
          href={`/list/${id}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow transition hover:bg-indigo-500"
        >
          <FaArrowRight className="h-4 w-4" />
          View list
        </Link>
        <button
          disabled={isDisabled}
          onClick={handleClick}
          aria-label="delete"
          className="mx-1 px-1"
        >
          <FaTrashCan className="h-4 w-4 text-slate-400 transition hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};
