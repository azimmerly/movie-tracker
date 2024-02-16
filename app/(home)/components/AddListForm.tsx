"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";

import { isValidListTitle } from "@/app/utils/validation";

export const AddListForm = () => {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (title: string) => {
      await axios.post("/api/lists/add", { title });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error);
      }
      setIsDisabled(false);
    },
    onSuccess: () => {
      toast.success("List created!");
      setTitle("");
      setIsDisabled(false);
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidListTitle(title)) {
      return toast.error("List title must not be empty");
    }

    mutate(title);
    setIsDisabled(true);
  };

  return (
    <div>
      <h2 className="mb-4 w-fit text-3xl font-bold text-indigo-600">
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