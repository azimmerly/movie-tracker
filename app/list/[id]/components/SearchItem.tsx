"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCircleCheck, FaPlus } from "react-icons/fa6";

import { getMovie } from "@/app/actions/movieDb";
import { addMovie } from "@/app/actions/movies";
import type { MovieType } from "@/app/types";

type SearchItemProps = {
  listId: string;
  movie: MovieType;
  listMovies: MovieType[];
};

export const SearchItem = ({ movie, listId, listMovies }: SearchItemProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const isMovieInList = listMovies.some(
    ({ movieDbId }) => movieDbId === movie.movieDbId,
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addMovie,
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

  const handleClick = async () => {
    setIsDisabled(true);
    const newMovie = await getMovie(movie.movieDbId);
    mutate({ listId, newMovie });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow">
      <Image
        alt={movie.title}
        width={80}
        height={120}
        src={`https://image.tmdb.org/t/p/w154${movie.image}`}
        className="h-[120px] w-[80px] rounded-md shadow"
      />
      <div className="flex flex-col">
        <p className="font-bold">{movie.title}</p>
        <p className="text-sm font-medium text-slate-500">{movie.year}</p>
        {isMovieInList ? (
          <div className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600">
            <FaCircleCheck className="h-4 w-4" />
            <p>Added to list</p>
          </div>
        ) : (
          <button
            onClick={handleClick}
            disabled={isDisabled || isMovieInList}
            className="mt-3 flex w-fit items-center gap-1.5 rounded-full border bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <FaPlus className="h-4 w-4" />
            Add movie
          </button>
        )}
      </div>
    </div>
  );
};
