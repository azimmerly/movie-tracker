import { twMerge } from "tailwind-merge";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ className, children }: CardProps) => (
  <div
    className={twMerge(
      "overflow-hidden rounded-lg bg-white p-3 shadow ring-1 ring-transparent ring-inset sm:p-3.5 dark:bg-mist-900 dark:ring-mist-800",
      className,
    )}
  >
    {children}
  </div>
);
