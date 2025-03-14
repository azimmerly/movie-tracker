import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { toast } from "sonner";

import { addMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { MovieInfo, MovieList, MovieSearchResponseData } from "@/types";
import { getMovieImage } from "@/utils/getMovieImage";

type SearchList = {
  listId: MovieList["id"];
  listMovieIds: Set<MovieInfo["id"]>;
  movies: MovieSearchResponseData;
};

export const SearchList = ({ movies, listId, listMovieIds }: SearchList) => {
  const handleAddMovie = async (movieId: MovieInfo["id"]) => {
    const res = await addMovie({ listId, movieId });
    if (res.success) {
      toast.success("Movie added");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="scrollbar-hide mt-4 max-h-[360px] overflow-auto pb-4">
      <div className="my-1 flex flex-col gap-2 px-1">
        {!movies.length ? (
          <Typography.Small className="mt-6 text-center font-medium" muted>
            No movies found with that title...
          </Typography.Small>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {movies.map(({ id, title, imagePath, year }, index) => (
              <li key={id} className="flex justify-between py-2">
                <div className="flex gap-3">
                  <Image
                    width={56}
                    height={84}
                    alt={title}
                    draggable={false}
                    priority={index <= 2}
                    src={getMovieImage(imagePath, "sm")}
                    className="h-[84px] w-14 rounded shadow"
                  />
                  <div className="flex flex-col gap-1">
                    <Typography.Small className="font-semibold">
                      {title}
                    </Typography.Small>
                    <Typography.Tiny className="flex items-start gap-0.5" muted>
                      <CalendarDaysIcon className="size-3.5" />
                      {year}
                    </Typography.Tiny>
                    {listMovieIds.has(id) ? (
                      <Chip
                        variant="success"
                        className="mt-2"
                        text={
                          <span className="flex items-center gap-1">
                            <CheckCircleIcon className="size-3.5" />
                            Added to list
                          </span>
                        }
                      />
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-2 text-blue-600 dark:text-blue-500"
                        icon={PlusCircleIcon}
                        onClick={() => handleAddMovie(id)}
                      >
                        Add movie
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {movies.length > 3 && (
              <div className="from-offwhite via-offwhite pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent dark:from-gray-800 dark:via-gray-800" />
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
