"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";
import { z } from "zod";

import { addUser } from "@/app/actions/users";
import {
  LoadingSpinner,
  ProviderAuthButtons,
  ValidationError,
} from "@/app/components";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Invalid username" })
      .max(20, { message: "Invalid username" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Alphanumeric characters only",
      }),
    email: z.string().email("Invalid email"),
    password: z.string().min(1, { message: "Password required" }),
    passwordConfirm: z.string().min(1, { message: "Password required" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords must match",
  });

export type FormData = z.infer<typeof formSchema>;

export const SignUpForm = () => {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, errors } = formState;

  const submitForm = async ({ username, email, password }: FormData) => {
    try {
      const res = await addUser({ username, email, password });

      if (!res.ok) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full max-w-sm flex-col items-start rounded-lg bg-white p-3 shadow sm:p-6">
        <form onSubmit={handleSubmit(submitForm)} className="w-full">
          <h1 className="mb-8 text-center text-2xl font-bold text-indigo-600">
            Create an Account
          </h1>
          <div className="mb-1 flex items-center gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-700"
            >
              Username
            </label>
            {errors.username?.message && (
              <ValidationError text={errors.username.message} />
            )}
          </div>
          <input
            id="username"
            type="text"
            maxLength={20}
            placeholder="Freya"
            {...register("username")}
            aria-invalid={!!errors.username}
            className="mb-3.5 w-full resize-none rounded-lg border-2 border-solid border-transparent bg-zinc-100 p-2 text-sm text-zinc-800 transition focus:border-zinc-800 active:border-zinc-800"
          />
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
          <div className="mb-1 flex items-center gap-2">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            {errors.passwordConfirm?.message && (
              <ValidationError text={errors.passwordConfirm.message} />
            )}
          </div>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Re-enter your password"
            {...register("passwordConfirm")}
            aria-invalid={!!errors.passwordConfirm}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <FaCircleUser className="h-4 w-4" />
                <span>Sign up</span>
              </>
            )}
          </button>
        </form>
        <ProviderAuthButtons />
      </div>
      <div className="text-sm font-medium text-slate-700">
        <span>Already have an account? </span>
        <Link href="/sign-in" className="text-indigo-600 underline">
          Sign in
        </Link>
      </div>
    </>
  );
};
