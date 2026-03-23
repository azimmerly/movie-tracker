"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";

import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { Movie } from "@/types";

type MovieOptionsProps = {
  movieId: Movie["id"];
};

export const MovieOptions = ({ movieId }: MovieOptionsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuOptions = [
    {
      label: "Movie details",
      icon: InformationCircleIcon,
      onClick: () => router.push(`/movie/${movieId}`),
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
