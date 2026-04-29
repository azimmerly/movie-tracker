"use client";

import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { Movie } from "@/types";
import { DeleteUserMovieDialog } from "./DeleteUserMovieDialog";

type MovieOptionsProps = {
  movieId: Movie["id"];
  owner: boolean;
  listCount: number;
};

export const MovieOptions = ({
  movieId,
  owner,
  listCount,
}: MovieOptionsProps) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const menuOptions = [
    {
      label: "Movie details",
      icon: InformationCircleIcon,
      onClick: () => router.push(`/movie/${movieId}`),
    },
    {
      hidden: !owner,
      label: "Remove movie",
      icon: TrashIcon,
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ] as const;

  return (
    <>
      <DropdownMenu options={menuOptions} />
      <DeleteUserMovieDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        movieId={movieId}
        listCount={listCount}
      />
    </>
  );
};
