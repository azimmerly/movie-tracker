import { Typography } from "@/components/ui/Typography";

export const OrDivider = () => (
  <div className="my-1 flex items-center gap-3 sm:my-1.5">
    <hr className="grow text-mist-200 dark:text-mist-800" />
    <Typography.Tiny muted>or</Typography.Tiny>
    <hr className="grow text-mist-200 dark:text-mist-800" />
  </div>
);
