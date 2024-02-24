import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export const ErrorMessage = () => (
  <div className="flex flex-col items-center gap-4 self-center">
    <p className=" font-semibold text-slate-700">
      Oops! Something went wrong...
    </p>
    <Link
      href="/"
      replace
      className="flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500"
    >
      <FaArrowRight className="h-4 w-4" />
      Go back
    </Link>
  </div>
);
