import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

export const ErrorMessage = () => (
  <div className="mt-20 text-center">
    <Typography.H1>Something went wrong</Typography.H1>
    <Typography.Body className="mt-4" muted>
      An unexpected error occurred.
    </Typography.Body>
    <Link
      href="/"
      className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-sm p-1 text-sm font-semibold hover:opacity-70 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
    >
      Go home
      <ArrowRightIcon className="size-4" />
    </Link>
  </div>
);
