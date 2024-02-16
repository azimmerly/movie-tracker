import { getServerSession } from "next-auth";
import { Righteous } from "next/font/google";
import Link from "next/link";
import { FaFilm } from "react-icons/fa6";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NavAuthLinks } from ".";

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

export const Nav = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex w-full justify-center bg-indigo-600 py-3">
      <div className="flex w-full max-w-5xl justify-between px-2 sm:px-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <FaFilm className="h-7 w-7" />
          <p className={`hidden text-2xl  sm:block ${righteous.className}`}>
            Movie Tracker
          </p>
        </Link>
        <div className="flex items-center gap-2">
          <NavAuthLinks user={session?.user} />
        </div>
      </div>
    </nav>
  );
};
