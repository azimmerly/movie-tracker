"use client";

import { UserCircleIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SocialAuthButton } from "@/components/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { authClient } from "@/lib/authClient";
import type { SignUpData } from "@/types";
import { signUpSchema } from "@/utils/validation/user";

export const SignUpForm = () => {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (formData: SignUpData) => {
    await authClient.signUp.email(formData, {
      onError: ({ error }) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Account created");
        router.refresh();
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <form
        className="flex flex-col gap-2 sm:gap-3"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <InputField
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          {...register("name")}
          errorMessage={formState.errors?.name?.message}
        />
        <InputField
          id="email"
          label="Email"
          type="text"
          autoComplete="email"
          {...register("email")}
          errorMessage={formState.errors?.email?.message}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          errorMessage={formState.errors?.password?.message}
        />
        <InputField
          id="passwordConfirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register("passwordConfirm")}
          errorMessage={formState.errors?.passwordConfirm?.message}
        />
        <Button
          type="submit"
          className="mt-3 w-full"
          icon={UserCircleIcon}
          disabled={formState.isSubmitting}
          busy={formState.isSubmitting}
        >
          Sign up
        </Button>
        <hr className="my-0.5 text-gray-200 sm:my-1 dark:text-gray-800" />
        <SocialAuthButton provider="github" className="w-full" />
      </form>
    </div>
  );
};
