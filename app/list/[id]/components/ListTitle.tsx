"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaRegPenToSquare,
} from "react-icons/fa6";

import { isValidListTitle } from "@/app/utils/validation";

type ListTitleProps = {
  id: string;
  title: string;
};

export const ListTitle = ({ title, id }: ListTitleProps) => {
  const [listTitle, setListTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/lists/update", { title: listTitle, id });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error);
      }
    },
    onSuccess: () => {
      toast.success("Title updated!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: [`list-${id}`] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidListTitle(listTitle)) {
      return;
    }

    mutate();
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setListTitle(title);
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-2 sm:justify-start sm:gap-4">
          <h1 className="break-words text-center text-3xl font-bold text-slate-700 sm:text-left sm:text-5xl">
            {title}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            aria-label="edit title"
            className="flex items-center gap-2 rounded-full font-medium text-indigo-500 transition hover:text-indigo-400"
          >
            <FaRegPenToSquare className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-3"
        >
          <input
            className="mb-4 w-full max-w-sm rounded-lg px-3 py-2 shadow"
            maxLength={40}
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel(e)}
          />
          <div className="mb-4 flex items-center gap-2">
            <button
              type="submit"
              className="rounded-full text-indigo-500 transition hover:text-indigo-400"
            >
              <FaRegCircleCheck className="h-7 w-7" aria-label="confirm" />
            </button>
            <button
              onClick={handleCancel}
              className="rounded-full text-red-400 transition hover:text-red-300"
            >
              <FaRegCircleXmark className="h-7 w-7" aria-label="cancel" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
