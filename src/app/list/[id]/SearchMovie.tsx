import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { addMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Typography } from "@/components/ui/Typography";
import type { MovieInfo, MovieList } from "@/types";
import { getMovieImage } from "@/utils/getMovieImage";

type SearchMovieProps = {
  id: MovieInfo["id"];
  title: MovieInfo["title"];
  year: MovieInfo["year"] | string;
  imagePath: MovieInfo["imagePath"] | null;
  listId: MovieList["id"];
  listMovieIds: Set<MovieInfo["id"]>;
};

export const SearchMovie = ({
  id,
  title,
  year,
  imagePath,
  listId,
  listMovieIds,
}: SearchMovieProps) => {
  const [isBusy, setIsBusy] = useState(false);

  const handleAddMovie = async (movieId: MovieInfo["id"]) => {
    setIsBusy(true);
    const res = await addMovie({ listId, movieId });
    setIsBusy(false);
    if (res.success) {
      toast.success("Movie added");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <li key={id} className="flex justify-between py-2">
      <div className="flex gap-3">
        <Image
          width={56}
          height={84}
          alt={title}
          draggable={false}
          src={getMovieImage(imagePath, "sm")}
          className="h-[84px] w-14 rounded shadow"
        />
        <div className="flex flex-col gap-1">
          <Typography.Small className="font-semibold">{title}</Typography.Small>
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
              disabled={isBusy}
              busy={isBusy}
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
  );
};
