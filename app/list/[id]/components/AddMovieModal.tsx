"use client";

import { useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";

import type { MovieType } from "@/app/types";
import { MovieSearchForm, SearchItem } from ".";

type AddMovieModalProps = {
  listId: string;
  listTitle: string;
  listMovies: MovieType[];
};

export const AddMovieModal = ({
  listTitle,
  listId,
  listMovies,
}: AddMovieModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moviesNotFound, setMoviesNotFound] = useState(false);
  const [searchMovies, setSearchMovies] = useState<MovieType[] | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchMovies(null);
    setMoviesNotFound(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="m-auto flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow transition hover:bg-indigo-500 sm:m-0"
      >
        <FaPlus className="h-5 w-5" />
        Add movie
      </button>
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed left-0 top-0 z-20 flex h-screen w-screen justify-center bg-black/70"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mx-2 mt-24 h-fit w-full max-w-3xl rounded-lg bg-slate-100 p-6 shadow-xl md:mt-56"
          >
            <h3 className="my-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <p className="text-lg font-bold text-slate-700">
                Add a movie to{" "}
              </p>
              <p className="rounded-full bg-slate-500 px-3 py-0.5 text-sm font-medium text-white">
                {listTitle}
              </p>
            </h3>
            <MovieSearchForm
              closeModal={closeModal}
              setMoviesNotFound={setMoviesNotFound}
              setSearchMovies={setSearchMovies}
            />
            <button
              onClick={closeModal}
              className="absolute right-3 top-3"
              aria-label="close"
            >
              <FaXmark className="h-7 w-7 text-slate-600 transition hover:text-slate-500" />
            </button>
            {moviesNotFound && (
              <p className="my-12 flex justify-center font-semibold text-slate-600">
                No movies found with that title...
              </p>
            )}
            <div className="mb-4 flex max-h-[30rem] flex-col gap-2 overflow-auto py-1 pr-1">
              {searchMovies &&
                searchMovies.map((movie) => (
                  <SearchItem
                    key={movie.movieDbId}
                    movie={movie}
                    listId={listId}
                    listMovies={listMovies}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
