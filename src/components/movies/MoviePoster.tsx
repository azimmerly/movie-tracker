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
    width: 60,
    height: 90,
    wrapperClass: "h-22.5 w-15 rounded",
    sizes: "60px",
  },
  md: {
    width: 80,
    height: 120,
    wrapperClass: "h-27 w-18 rounded-md sm:h-33 sm:w-22",
    sizes: "(min-width: 640px) 88px, 72px",
  },
  lg: {
    width: 320,
    height: 480,
    wrapperClass: "h-84 w-56 rounded-lg lg:h-120 lg:w-80",
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
        className="relative h-full w-full"
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
