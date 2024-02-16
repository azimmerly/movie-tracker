"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaRegSquare,
  FaSquareCheck,
} from "react-icons/fa6";

import type { MovieType } from "@/app/types";

type MovieAttributesProps = {
  listId: string;
  movie: MovieType;
};

export const MovieAttributes = ({ listId, movie }: MovieAttributesProps) => {
  const [disabled, setIsDisabled] = useState(false);
  const [watched, setWatched] = useState(movie.isWatched);
  const [favorite, setFavorite] = useState(movie.isFavorite);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/movies/update", {
        isFavorite: favorite,
        isWatched: watched,
        movieId: movie.id,
      });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error);
      }
      setIsDisabled(false);
    },
    onSuccess: () => {
      setIsDisabled(false);
      queryClient.invalidateQueries({ queryKey: [`list-${listId}`] });
    },
  });

  return (
    <div className="mt-3 flex flex-wrap gap-4">
      <label className="flex cursor-pointer items-center gap-1">
        {watched ? (
          <FaSquareCheck className="mb-0.5 h-5 w-5 text-indigo-500" />
        ) : (
          <FaRegSquare className="mb-0.5 h-5 w-5 text-indigo-500" />
        )}
        <input
          disabled={disabled}
          checked={watched}
          type="checkbox"
          className="hidden"
          onChange={(e) => {
            setWatched(e.target.checked);
            setIsDisabled(true);
            mutate();
          }}
        />
        <span className="text-sm font-medium text-slate-700">Watched</span>
      </label>
      <label className="flex cursor-pointer items-center gap-1">
        {favorite ? (
          <FaHeart className="mb-0.5 h-5 w-5 text-red-400" />
        ) : (
          <FaRegHeart className="mb-0.5 h-5 w-5 text-red-400" />
        )}
        <input
          disabled={disabled}
          type="checkbox"
          checked={favorite}
          onChange={(e) => {
            setFavorite(e.target.checked);
            setIsDisabled(true);
            mutate();
          }}
          className="hidden"
        />
        <span className="text-sm font-medium text-slate-700">Favorite</span>
      </label>
    </div>
  );
};
