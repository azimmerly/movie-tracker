import { Typography } from "@/components/ui/Typography";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const NotFound = () => (
  <div className="text-center">
    <Typography.Body className="font-semibold text-blue-600 dark:text-blue-500">
      404
    </Typography.Body>
    <Typography.H1 className="mt-2">Page not found</Typography.H1>
    <Typography.Body className="mt-6" muted>
      Sorry, we couldn’t find the page you’re looking for.
    </Typography.Body>
    <Link
      replace
      href="/"
      className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-sm p-1 text-sm font-semibold hover:opacity-70 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
    >
      Go back
      <ArrowRightIcon className="size-4" />
    </Link>
  </div>
);

export default NotFound;
