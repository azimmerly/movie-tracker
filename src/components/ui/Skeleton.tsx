import { twMerge } from "tailwind-merge";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={twMerge(
      "animate-pulse rounded-lg bg-mist-200/60 dark:bg-mist-900",
      className,
    )}
  />
);
