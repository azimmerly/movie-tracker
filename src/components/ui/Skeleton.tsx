import { twMerge } from "tailwind-merge";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={twMerge(
      "animate-pulse rounded-md bg-mist-200 dark:bg-mist-800",
      className,
    )}
  />
);
