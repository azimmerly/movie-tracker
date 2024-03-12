"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

import { deleteMovie } from "@/app/actions/movies";
import type { MovieType } from "@/app/types";
import { MovieAttributes, MovieDetailsModal } from ".";

type MovieCardProps = {
  listId: string;
  movie: MovieType;
};

export const MovieCard = ({ movie, listId }: MovieCardProps) => {
  const { id, title, year, genres, image } = movie;
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteMovie,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [`list-${listId}`] });
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleClick = () => {
    setIsDisabled(true);
    mutate({ movieId: id });
  };

  return (
    <div className="relative flex w-full items-center gap-4 rounded-lg bg-white p-3 shadow sm:p-4">
      <Image
        width={96}
        height={120}
        alt={title}
        src={`https://image.tmdb.org/t/p/w185${image}`}
        className="w-24 self-start rounded-md shadow-md sm:w-28"
      />
      <div className="flex flex-col content-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-slate-700">{title}</p>
          <p className="text-sm font-medium text-slate-500">({year})</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {genres?.map((genre, i) => (
            <div
              key={i}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600"
            >
              {genre}
            </div>
          ))}
        </div>
        <MovieAttributes listId={listId} movie={movie} />
        <MovieDetailsModal movie={movie} />
        <button aria-label="delete" onClick={handleClick} disabled={isDisabled}>
          <FaTrashCan className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 transition hover:text-red-400 sm:right-3 sm:top-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};
