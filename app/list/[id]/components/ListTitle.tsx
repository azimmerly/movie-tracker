"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaRegPenToSquare,
} from "react-icons/fa6";

import { updateList } from "@/app/actions/lists";
import { LIST_TITLE_MAX_CHARS } from "@/app/utils/validation";

type ListTitleProps = {
  id: string;
  title: string;
};

export const ListTitle = ({ title, id }: ListTitleProps) => {
  const [listTitle, setListTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateList,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: [`list-${id}`] });
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title === listTitle) {
      setIsEditing(false);
      return;
    }

    setIsDisabled(true);
    mutate({ listId: id, listTitle });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setListTitle(title);
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-3 sm:justify-start sm:gap-4">
          <h1 className="break-words text-center text-3xl font-bold text-slate-700 sm:text-left sm:text-5xl">
            {title}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            aria-label="edit title"
            className="flex items-center rounded-full font-medium text-indigo-500 transition hover:text-indigo-400"
          >
            <FaRegPenToSquare className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-3"
        >
          <input
            autoFocus
            className="mb-5 w-full max-w-sm rounded-lg px-3 py-2 shadow"
            maxLength={LIST_TITLE_MAX_CHARS}
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel(e)}
          />
          <div className="mb-5 flex items-center gap-2">
            <button
              type="submit"
              disabled={isDisabled}
              className="rounded-full text-indigo-500 transition hover:text-indigo-400"
            >
              <FaRegCircleCheck className="h-6 w-6" aria-label="confirm" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full text-red-400 transition hover:text-red-300"
            >
              <FaRegCircleXmark className="h-6 w-6" aria-label="cancel" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
