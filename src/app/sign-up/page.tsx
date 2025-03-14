import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import logoImage from "@/assets/logo.png";
import { Typography } from "@/components/ui/Typography";
import { SignUpForm } from "./SignUpForm";

const SignUp = async () => {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="-mt-16 flex flex-1 flex-col justify-center gap-8 px-3">
      <div>
        <Image
          priority
          draggable={false}
          src={logoImage}
          alt="logo"
          className="mx-auto mb-1 size-14"
        />
        <Typography.H3 className="text-center">Create an account</Typography.H3>
      </div>
      <SignUpForm />
      <Typography.Small className="mt-6 text-center" muted>
        Already have an account?{" "}
        <Typography.Link href="/sign-in">Sign in</Typography.Link>
      </Typography.Small>
    </div>
  );
};

export default SignUp;
