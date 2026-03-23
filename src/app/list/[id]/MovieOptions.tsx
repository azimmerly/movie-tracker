"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteMovie } from "@/actions/movie";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { Movie, MovieList } from "@/types";

type MovieOptionsProps = {
  owner: boolean;
  movieId: Movie["id"];
  listId: MovieList["id"];
  movie: Movie;
};

export const MovieOptions = ({
  owner,
  movieId,
  listId,
  movie,
}: MovieOptionsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuOptions = [
    {
      label: "Movie details",
      icon: InformationCircleIcon,
      onClick: () => router.push(`/movie/${movie.id}`),
    },
    {
      hidden: !owner,
      label: "Remove movie",
      icon: TrashIcon,
      onClick: async () => {
        const res = await deleteMovie({ movieId, listId });
        if (res.success) {
          toast.success("Movie removed");
        } else {
          toast.error(res.message);
        }
      },
    },
  ] as const;

  return (
    <DropdownMenu
      key={pathname}
      options={menuOptions}
      iconButton={
        <EllipsisVerticalIcon className="size-5 text-mist-400 hover:text-mist-500 dark:text-mist-500 dark:hover:text-mist-400" />
      }
    />
  );
};
