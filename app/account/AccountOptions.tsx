"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

import { deleteUser } from "@/app/actions/users";

export const AccountOptions = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        signOut();
        router.refresh();
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleClick = () => {
    setIsDisabled(true);
    mutate();
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:items-start">
      <h1 className="text-4xl font-bold">Account Options</h1>
      <button
        disabled={isDisabled}
        onClick={handleClick}
        className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 font-medium text-white shadow transition hover:bg-red-400 disabled:bg-slate-400"
      >
        <FaTrashCan className="h-4 w-4" />
        Delete account
      </button>
    </div>
  );
};
