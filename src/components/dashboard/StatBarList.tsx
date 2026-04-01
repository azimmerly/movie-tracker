import { Typography } from "@/components/ui/Typography";

type StatBarListProps = {
  items: {
    label: string;
    value: React.ReactNode;
    percent: number;
    description: string;
  }[];
};

export const StatBarList = ({ items }: StatBarListProps) => (
  <ul className="flex flex-col gap-2.5">
    {items.map(({ label, value, percent, description }) => (
      <li key={label}>
        <div className="mb-0.5 flex items-baseline justify-between gap-2">
          <Typography.Small className="truncate font-medium">
            {label}
          </Typography.Small>
          <Typography.Small className="shrink-0 font-semibold">
            {value}
          </Typography.Small>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-mist-200 dark:bg-mist-700">
          <div
            style={{ width: `${Math.min(percent, 100)}%` }}
            className="h-full rounded-full bg-amber-400 dark:bg-amber-500"
          />
        </div>
        <Typography.Tiny muted className="mt-0.5">
          {description}
        </Typography.Tiny>
      </li>
    ))}
  </ul>
);
