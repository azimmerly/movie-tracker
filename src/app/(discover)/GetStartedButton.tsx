"use client";

import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";

export const GetStartedButton = () => {
  const router = useRouter();

  const handleClick = () => {
    toast.info("Sign in to get started");
    router.push("/sign-in");
  };

  return (
    <Button
      icon={PlusCircleIcon}
      className="w-full min-w-max sm:w-fit"
      onClick={handleClick}
    >
      Create new list
    </Button>
  );
};
