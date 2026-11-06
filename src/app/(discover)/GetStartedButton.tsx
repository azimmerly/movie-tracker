"use client";

import { SparklesIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

export const GetStartedButton = () => {
  const router = useRouter();

  return (
    <Button
      icon={SparklesIcon}
      className="w-full min-w-max sm:w-fit"
      onClick={() => router.push("/sign-up")}
    >
      Get started
    </Button>
  );
};
