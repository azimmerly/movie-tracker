"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";

import { addList } from "@/app/actions/lists";

export const AddListForm = () => {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addList,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(data.message);
      } else {
        setTitle("");
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["lists"] });
      }
    },
    onSettled: () => {
      setIsDisabled(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    mutate({ listTitle: title });
  };

  return (
    <div>
      <h2 className="mb-4 w-fit text-2xl font-bold text-indigo-600 sm:text-3xl">
        Create a new list
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          name="title"
          type="text"
          value={title}
          maxLength={40}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Spooky horror movies"
          className="max-w-md flex-1 rounded-lg px-3 py-2 shadow"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="flex w-fit items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-80"
        >
          <FaPlus className="h-4 w-4" />
          Create list
        </button>
      </form>
    </div>
  );
};
