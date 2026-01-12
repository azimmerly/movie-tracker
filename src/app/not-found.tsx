import { Typography } from "@/components/ui/Typography";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const NotFound = () => (
  <div className="mt-20 text-center">
    <Typography.H1>Page not found</Typography.H1>
    <Typography.Body className="mt-4" muted>
      Sorry, we couldn’t find the page you’re looking for.
    </Typography.Body>
    <Link
      replace
      href="/"
      className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-sm p-1 text-sm font-semibold hover:opacity-70 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
    >
      Go back
      <ArrowRightIcon className="size-4" />
    </Link>
  </div>
);

export default NotFound;
