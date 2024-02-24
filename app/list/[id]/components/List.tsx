"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

import { ErrorMessage, LoadingDots } from "@/app/components";
import type { ListType, MovieType } from "@/app/types";
import { filterMovies } from "@/app/utils/filterMovies";
import placeholder from "@/public/placeholder-1.svg";
import { AddMovieModal, FilterSelector, ListTitle, MovieCard } from ".";

type ListProps = {
  id: string;
};

const getList = async (listId: string) => {
  if (!listId) {
    return null;
  }
  const res = await axios.get(`/api/lists/${listId}`);
  return res.data;
};

export const List = ({ id }: ListProps) => {
  const [filter, setFilter] = useState("all");
  const { data, error, isPending } = useQuery<ListType>({
    queryKey: [`list-${id}`],
    queryFn: () => getList(id),
  });

  if (error) {
    return <ErrorMessage />;
  }

  if (isPending) {
    return <LoadingDots className="mt-24" />;
  }

  const filteredMovies = filterMovies(data.movies, filter);

  return (
    <>
      <ListTitle title={data.title} id={data.id} />
      <AddMovieModal
        listId={id}
        listTitle={data.title}
        listMovies={data.movies}
      />
      <FilterSelector filter={filter} setFilter={setFilter} />
      {!data.movies.length ? (
        <div className="my-16 flex flex-col items-center gap-8">
          <p className="font-semibold text-slate-600">
            You don’t have any movies in this list yet...
          </p>
          <Image
            src={placeholder}
            alt="add movies"
            className="h-full max-h-72 w-auto"
          />
        </div>
      ) : (
        <div className="my-2 flex flex-col gap-3">
          {filteredMovies.length ? (
            filteredMovies.map((movie: MovieType) => {
              return <MovieCard key={movie.id} movie={movie} listId={id} />;
            })
          ) : (
            <p className="mt-8 self-center font-medium text-slate-600">
              Your <span className="font-semibold">{filter}</span> movies will
              appear here...
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default List;
