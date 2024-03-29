import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SignInForm } from "./SignInForm";

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="col mt-12 flex flex-col items-center gap-6 sm:mt-20">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
