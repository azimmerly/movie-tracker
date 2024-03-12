"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaRegSquare,
  FaSquareCheck,
} from "react-icons/fa6";

import { updateMovie } from "@/app/actions/movies";
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
    mutationFn: updateMovie,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        queryClient.invalidateQueries({ queryKey: [`list-${listId}`] });
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;

    setIsDisabled(true);

    if (name === "watched") {
      setWatched(checked);
    } else if (name === "favorite") {
      setFavorite(checked);
    }

    mutate({
      isFavorite: name === "favorite" ? checked : favorite,
      isWatched: name === "watched" ? checked : watched,
      movieId: movie.id,
    });
  };

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
          name="watched"
          type="checkbox"
          className="hidden"
          onChange={handleChange}
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
          checked={favorite}
          name="favorite"
          type="checkbox"
          className="hidden"
          onChange={handleChange}
        />
        <span className="text-sm font-medium text-slate-700">Favorite</span>
      </label>
    </div>
  );
};
