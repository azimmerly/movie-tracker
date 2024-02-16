"use client";

import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { searchMovies } from "@/app/actions/movieDb";
import type { MovieType } from "@/app/types";
import { isValidSearch } from "@/app/utils/validation";

type MovieSearchFormProps = {
  closeModal: () => void;
  setSearchMovies: (movies: MovieType[] | null) => void;
  setMoviesNotFound: (toggle: boolean) => void;
};

export const MovieSearchForm = ({
  closeModal,
  setSearchMovies,
  setMoviesNotFound,
}: MovieSearchFormProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidSearch(searchInput)) {
      return;
    }

    setSearchInput("");

    const movies = await searchMovies(searchInput);

    if (movies) {
      setSearchMovies(movies);
      setMoviesNotFound(false);
    } else {
      setSearchMovies(null);
      setMoviesNotFound(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        <input
          autoFocus
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && closeModal()}
          placeholder="Search for a movie"
          className="max-w-xl flex-1 rounded-lg px-3 py-2 shadow"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 font-medium text-white shadow transition hover:bg-indigo-500"
        >
          <FaMagnifyingGlass className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
};
