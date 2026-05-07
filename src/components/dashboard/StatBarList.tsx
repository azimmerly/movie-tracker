import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";

const BAR_COLORS = {
  amber: "bg-amber-400 dark:bg-amber-500",
  emerald: "bg-emerald-400 dark:bg-emerald-500",
  blue: "bg-blue-400 dark:bg-blue-500",
  violet: "bg-violet-400 dark:bg-violet-500",
} as const;

type StatBarListProps = {
  items: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    percent: number;
    description: string;
  }[];
  color: keyof typeof BAR_COLORS;
};

export const StatBarList = ({ items, color }: StatBarListProps) => (
  <ul className="flex flex-col gap-2.5">
    {items.map(({ label, value, icon, percent, description }, index) => (
      <li key={index}>
        <div className="mb-0.5 flex h-5 items-center justify-between gap-2">
          <Typography.Small className="truncate font-medium">
            {label}
          </Typography.Small>
          <Typography.Small className="inline-flex shrink-0 items-center gap-1 font-semibold">
            {icon}
            {value}
          </Typography.Small>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-mist-200 dark:bg-mist-700">
          <div
            style={{ width: `${Math.min(percent, 100)}%` }}
            className={twMerge("h-full rounded-full", BAR_COLORS[color])}
          />
        </div>
        <Typography.Tiny muted className="mt-0.5 block h-4">
          {description}
        </Typography.Tiny>
      </li>
    ))}
  </ul>
);
