"use client";

import { UserCircleIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { SocialAuthButton } from "@/components/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { InputField } from "@/components/ui/InputField";
import { authClient } from "@/lib/authClient";
import type { SignInData } from "@/types";
import { signInSchema } from "@/utils/validation/user";

export const SignInForm = () => {
  const router = useRouter();
  const { control, register, handleSubmit, formState, reset } =
    useForm<SignInData>({
      resolver: zodResolver(signInSchema),
      defaultValues: { rememberMe: true },
    });

  const handleSignIn = async (formData: SignInData) => {
    await authClient.signIn.email(formData, {
      onError: ({ error }) => {
        toast.error(error.message);
        reset({ ...formData, password: "" });
      },
      onSuccess: () => {
        toast.success("Signed in");
        router.refresh();
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <form
        className="flex flex-col gap-2 sm:gap-3"
        onSubmit={handleSubmit(handleSignIn)}
      >
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
          autoComplete="current-password"
          {...register("password")}
          errorMessage={formState.errors?.password?.message}
        />
        <Controller
          name="rememberMe"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Checkbox
              label="Remember me"
              checked={field.value}
              onChange={field.onChange}
              className="mt-1 font-medium"
            />
          )}
        />
        <Button
          type="submit"
          className="mt-3 w-full"
          icon={UserCircleIcon}
          disabled={formState.isSubmitting}
          busy={formState.isSubmitting}
        >
          Sign in
        </Button>
        <hr className="my-0.5 text-gray-200 sm:my-1 dark:text-gray-800" />
        <SocialAuthButton provider="github" className="w-full" />
      </form>
    </div>
  );
};
