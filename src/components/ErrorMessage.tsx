import { ArrowRightIcon, XCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

export const ErrorMessage = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
    <Typography.Small className="mx-auto flex w-max gap-2 rounded-md bg-red-50 p-4 font-medium text-red-600 dark:bg-red-400/15 dark:text-red-400">
      <XCircleIcon
        aria-hidden="true"
        className="size-4.5 text-red-600 dark:text-red-400"
      />
      Oops! Something went wrong...
    </Typography.Small>
    <Link
      href="/"
      className="mx-auto mt-4 flex w-fit cursor-pointer items-center gap-1 rounded-sm p-1 text-sm font-semibold hover:opacity-70 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
    >
      Go back
      <ArrowRightIcon className="size-4" />
    </Link>
  </div>
);
