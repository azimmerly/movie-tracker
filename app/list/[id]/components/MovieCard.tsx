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
  index: number;
};

export const MovieCard = ({ movie, listId, index }: MovieCardProps) => {
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
        priority={index <= 2}
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
        <div className="flex gap-2">
          <MovieDetailsModal movie={movie} />
          <button
            aria-label="delete"
            onClick={handleClick}
            disabled={isDisabled}
            className="mt-3 sm:hidden"
          >
            <FaTrashCan className="h-4 w-4 text-slate-400 transition hover:text-red-400" />
          </button>
        </div>
        <button
          aria-label="delete"
          onClick={handleClick}
          disabled={isDisabled}
          className="absolute right-3 top-3 hidden sm:block"
        >
          <FaTrashCan className="h-4 w-4 text-slate-400 transition hover:text-red-400 " />
        </button>
      </div>
    </div>
  );
};
