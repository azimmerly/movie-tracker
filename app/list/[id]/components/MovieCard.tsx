"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

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
    mutationFn: async (id: string) => {
      await axios.post("/api/movies/delete", { movieId: id });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error);
      }
      setIsDisabled(false);
    },
    onSuccess: () => {
      toast.success("Movie removed!");
      setIsDisabled(false);
      queryClient.invalidateQueries({ queryKey: [`list-${listId}`] });
    },
  });

  const handleDelete = () => {
    mutate(id);
    setIsDisabled(true);
  };

  return (
    <div className="relative flex min-h-[200px] w-full items-center gap-4 rounded-lg bg-white p-2 shadow sm:p-4">
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
        <button
          aria-label="delete"
          onClick={handleDelete}
          disabled={isDisabled}
        >
          <FaTrashCan className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 transition hover:text-red-400 sm:right-3 sm:top-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};
