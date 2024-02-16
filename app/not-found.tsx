import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const NotFoundPage = () => (
  <div className="m-auto mt-20 flex w-fit flex-col items-center gap-6 font-semibold">
    <p>Oops! Looks like you took a wrong turn...</p>
    <Link
      href="/"
      replace
      className="flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm text-white shadow transition hover:bg-indigo-500"
    >
      <FaArrowRight className="h-4 w-4" />
      Go back
    </Link>
  </div>
);

export default NotFoundPage;
