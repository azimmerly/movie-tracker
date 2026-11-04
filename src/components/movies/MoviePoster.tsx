import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { Skeleton } from "@/components/ui/Skeleton";
import { getMovieImage, type MovieImageSize } from "@/utils/getMovieImage";

type MoviePosterProps = {
  alt: string;
  href?: string;
  posterPath: string;
  size: MovieImageSize;
  priority?: boolean;
};

const IMAGE_CONFIG = {
  sm: {
    width: 64,
    height: 96,
    wrapperClass: "h-24 w-16 rounded",
    sizes: "64px",
  },
  md: {
    width: 80,
    height: 120,
    wrapperClass: "h-31.5 w-21 rounded-md sm:h-36 sm:w-24",
    sizes: "(min-width: 640px) 96px, 84px",
  },
  lg: {
    width: 320,
    height: 480,
    wrapperClass: "h-84 w-56 rounded-lg lg:h-120 lg:w-80 lg:rounded-xl",
    sizes: "(min-width: 1024px) 320px, 224px",
  },
} as const;

export const MoviePoster = ({
  posterPath,
  alt,
  size,
  href,
  priority,
}: MoviePosterProps) => {
  const { width, height, wrapperClass, sizes } = IMAGE_CONFIG[size];
  const className = twMerge("relative shrink-0 overflow-hidden", wrapperClass);

  const content = (
    <>
      <Skeleton className="absolute inset-0" />
      <Image
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        src={getMovieImage(posterPath, size)}
        className="relative h-full w-full shadow-xs"
        priority={priority}
        draggable={false}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href as Route} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};
