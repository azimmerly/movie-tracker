import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";

import { deleteMovie } from "@/actions/movie";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { Movie, MovieInfo } from "@/types";

type MovieOptionsProps = {
  owner: boolean;
  movieId: Movie["id"];
  listId: Movie["listId"];
  movieInfo: MovieInfo;
};

export const MovieOptions = ({
  owner,
  movieId,
  listId,
  movieInfo,
}: MovieOptionsProps) => {
  const menuOptions = [
    {
      label: "Movie details",
      icon: InformationCircleIcon,
      onClick: () => {
        redirect(`/movie/${movieInfo.id}`, RedirectType.push);
      },
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
      options={menuOptions}
      iconButton={
        <EllipsisVerticalIcon className="size-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-600" />
      }
    />
  );
};
