import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import logoImage from "@/assets/logo.png";
import { Typography } from "@/components/ui/Typography";
import { SignInForm } from "./SignInForm";

const SignIn = async () => {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 px-3">
      <div>
        <Image
          priority
          draggable={false}
          src={logoImage}
          alt="logo"
          className="mx-auto mb-1 size-14"
        />
        <Typography.H3 className="text-center">
          Sign in to your account
        </Typography.H3>
      </div>
      <SignInForm />
      <Typography.Small className="mt-6 text-center" muted>
        Don&#39;t have an account?{" "}
        <Typography.Link href="/sign-up">Sign up</Typography.Link>
      </Typography.Small>
    </div>
  );
};

export default SignIn;
