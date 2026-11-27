import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { Chip } from "@/components/ui/Chip";

type GenreChipProps = {
  genre: string;
  className?: string;
};

export const GenreChip = ({ genre, className }: GenreChipProps) => (
  <Link href={{ pathname: "/movies", query: { genre } }} className="group">
    <Chip
      text={genre}
      variant="primary"
      className={twMerge(
        "transition-colors group-hover:bg-blue-400/25",
        className,
      )}
    />
  </Link>
);
