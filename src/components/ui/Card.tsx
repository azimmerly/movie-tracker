import { twMerge, type ClassNameValue } from "tailwind-merge";

type CardProps = {
  children: React.ReactNode;
  className?: ClassNameValue;
};

export const Card = ({ className, children }: CardProps) => (
  <div
    className={twMerge(
      "overflow-hidden rounded-lg bg-white p-3 shadow ring-1 ring-transparent ring-inset sm:p-4 dark:bg-mist-900 dark:ring-mist-800",
      className,
    )}
  >
    {children}
  </div>
);
