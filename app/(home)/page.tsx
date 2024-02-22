import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FaCircleUser } from "react-icons/fa6";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import placeholder from "@/public/placeholder-2.svg";
import { AddListForm, MyLists } from "./components";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="mt-28 flex flex-col items-center gap-16">
        <Image
          priority
          src={placeholder}
          alt="no movies in this list"
          className="h-full max-h-72 w-auto"
        />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold text-slate-600">
            Sign-in / Sign-up to get started!
          </h1>
          <Link
            href="/sign-up"
            className="flex w-fit items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-7 py-2.5 font-medium text-white shadow hover:bg-indigo-500"
          >
            <FaCircleUser className="h-4.5 w-4.5" />
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 flex flex-col gap-16">
      <AddListForm />
      <MyLists />
    </div>
  );
};

export default HomePage;
