"use client";

import {
  FilmIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { searchMovies } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/InputField";
import { Typography } from "@/components/ui/Typography";
import type {
  MovieInfo,
  MovieList,
  MovieSearchData,
  MovieSearchResponseData,
} from "@/types";
import { movieSearchSchema } from "@/utils/validation/movie";
import { SearchMovie } from "./SearchMovie";

type AddMovieDialogProps = {
  listId: MovieList["id"];
  listMovieIds: Set<MovieInfo["id"]>;
};

export const AddMovieDialog = ({
  listId,
  listMovieIds,
}: AddMovieDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movies, setMovies] = useState<MovieSearchResponseData>();
  const { register, reset, handleSubmit, formState } = useForm<MovieSearchData>(
    { resolver: zodResolver(movieSearchSchema) },
  );

  const handleSearchMovie = async (formData: MovieSearchData) => {
    const res = await searchMovies(formData);
    if (res.success) {
      reset();
      setMovies(res.data);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        icon={PlusCircleIcon}
        className="w-full sm:w-fit"
      >
        Add movie
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onTransitionEnd={() => {
          reset();
          setMovies(undefined);
        }}
        className="sm:max-w-xl"
      >
        <div className="mb-3 flex flex-col items-center gap-3 sm:mb-5 sm:flex-row">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-gray-700">
            <FilmIcon
              aria-hidden="true"
              className="size-[22px] text-blue-600 dark:text-blue-500"
            />
          </div>
          <Typography.H3 className="text-center sm:text-left">
            Add a movie
          </Typography.H3>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleSearchMovie)}
        >
          <InputField
            autoFocus
            id="list-title"
            type="text"
            label="Search for a movie"
            placeholder="Enter a movie title"
            {...register("title")}
            errorMessage={formState.errors?.title?.message}
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-fit"
              icon={MagnifyingGlassIcon}
              disabled={formState.isSubmitting || !formState.isDirty}
              busy={formState.isSubmitting}
            >
              Search
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-fit"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
        {movies && (
          <div className="scrollbar-hide mt-4 max-h-[360px] overflow-auto pb-4">
            <div className="my-1 flex flex-col gap-2 px-1">
              {!movies.length ? (
                <Typography.Small
                  muted
                  className="mt-6 text-center font-medium"
                >
                  No movies found with that title...
                </Typography.Small>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {movies.map((movie, index) => (
                    <SearchMovie
                      {...movie}
                      key={index}
                      listId={listId}
                      listMovieIds={listMovieIds}
                    />
                  ))}
                  {movies.length > 3 && (
                    <div className="from-offwhite via-offwhite pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent dark:from-gray-800 dark:via-gray-800" />
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};
