"use client";

import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addUserMovie } from "@/actions/movie";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { AddToListDialog } from "./AddToListDialog";

type MovieUserActionsProps = {
  inLibrary: boolean;
} & React.ComponentProps<typeof AddToListDialog>;

export const MovieUserActions = ({
  movie,
  inLibrary,
  lists,
}: MovieUserActionsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleAddUserMovie = async () => {
    setBusy(true);
    const res = await addUserMovie({ movieId: movie.id });
    if (res.success) {
      toast.success("Added to your movies");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setBusy(false);
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      {inLibrary ? (
        <Chip
          variant="success"
          icon={CheckCircleIcon}
          className="pointer-events-none w-full justify-center py-2 text-sm"
          text="In my movies"
        />
      ) : (
        <Button
          className="w-full"
          icon={PlusCircleIcon}
          busy={busy}
          disabled={busy}
          onClick={handleAddUserMovie}
        >
          Add to my movies
        </Button>
      )}
      <AddToListDialog movie={movie} lists={lists} />
    </div>
  );
};
