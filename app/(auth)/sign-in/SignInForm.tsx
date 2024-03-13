"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";
import { z } from "zod";

import {
  LoadingSpinner,
  ProviderAuthButtons,
  ValidationError,
} from "@/app/components";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, { message: "Password required" }),
});

type FormData = z.infer<typeof formSchema>;

export const SignInForm = () => {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, errors } = formState;

  const submitForm = async ({ email, password }: FormData) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.ok) {
      toast.error("Invalid username or password");
    } else {
      toast.success("Signed in");
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex w-full max-w-sm flex-col items-start rounded-lg bg-white p-3 shadow sm:p-6">
        <form onSubmit={handleSubmit(submitForm)} className="w-full">
          <h1 className="mb-8 text-center text-2xl font-bold text-indigo-600">
            Sign In
          </h1>
          <div className="mb-1 flex items-center gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            {errors.email?.message && (
              <ValidationError text={errors.email.message} />
            )}
          </div>
          <input
            id="email"
            type="text"
            placeholder="freya@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className="mb-3.5 w-full resize-none rounded-lg border-2 border-solid border-transparent bg-zinc-100 p-2 text-sm text-zinc-800 transition focus:border-zinc-800 active:border-zinc-800"
          />
          <div className="mb-1 flex items-center gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            {errors.password?.message && (
              <ValidationError text={errors.password.message} />
            )}
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className="mb-3.5 w-full resize-none rounded-lg border-2 border-solid border-transparent bg-zinc-100 p-2 text-sm text-zinc-800 transition focus:border-zinc-800 active:border-zinc-800"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 self-center rounded-full border-none bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-500"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FaCircleUser className="h-4 w-4" />
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>
        <ProviderAuthButtons />
      </div>
      <div className="text-sm font-medium text-slate-700">
        <span>Don&#39;t have an account? </span>
        <Link href="/sign-up" className="text-indigo-600 underline">
          Sign up
        </Link>
      </div>
    </>
  );
};
