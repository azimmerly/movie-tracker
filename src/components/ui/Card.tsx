import { twMerge, type ClassNameValue } from "tailwind-merge";

type CardProps = {
  children: React.ReactNode;
  className?: ClassNameValue;
};

export const Card = ({ className, children }: CardProps) => (
  <div
    className={twMerge(
      "overflow-hidden rounded-lg bg-white p-3 shadow ring-1 ring-transparent ring-inset sm:p-5 dark:bg-gray-800/70 dark:ring-gray-700/70",
      className,
    )}
  >
    {children}
  </div>
);
