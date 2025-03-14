"use client";

import { useState } from "react";
import { toast } from "sonner";

import GitHubIcon from "@/assets/github.svg";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/authClient";

const AUTH_PROVIDERS = {
  github: {
    label: "GitHub",
    icon: GitHubIcon,
  },
} as const;

type SocialAuthButtonProps = {
  provider: "github";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SocialAuthButton = ({
  provider,
  ...props
}: SocialAuthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    await authClient.signIn.social(
      { provider, callbackURL: "/" },
      {
        onError: ({ error }) => {
          setIsPending(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Button
      busy={isPending}
      disabled={isPending}
      icon={AUTH_PROVIDERS[provider].icon}
      onClick={handleClick}
      variant="secondary"
      {...props}
    >
      Continue with {AUTH_PROVIDERS[provider].label}
    </Button>
  );
};
