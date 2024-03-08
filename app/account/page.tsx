import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AccountOptions } from "./AccountOptions";

const AccountPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-12 text-slate-700 sm:mt-20 sm:items-start">
      <div className="flex w-fit items-center gap-4 rounded-xl bg-white px-5 py-3 shadow sm:px-10 sm:py-6">
        {session.user.image ? (
          <Image
            priority
            src={session.user.image}
            alt="user profile"
            width={64}
            height={64}
            className="h-12 w-12 rounded-full sm:h-16 sm:w-16"
          />
        ) : (
          <FaCircleUser className="h-12 w-12 text-slate-400 sm:h-16 sm:w-16 " />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="break-word text-2xl font-bold">{session.user.name}</h2>
          <p className="break-all">{session.user.email}</p>
        </div>
      </div>
      <AccountOptions />
    </div>
  );
};

export default AccountPage;
