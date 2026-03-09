import { FilmIcon, ListBulletIcon, StarIcon } from "@heroicons/react/16/solid";

import { Typography } from "@/components/ui/Typography";

const STATS = {
  listCount: {
    label: "Lists",
    icon: ListBulletIcon,
  },
  totalMovies: {
    label: "Movies",
    icon: FilmIcon,
  },
  totalRatings: {
    label: "Ratings",
    icon: StarIcon,
  },
} as const;

type DashboardStatsProps = {
  stats: Record<keyof typeof STATS, number>;
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="flex w-fit divide-x divide-mist-200 dark:divide-mist-700">
    {Object.entries(stats).map(([key, value]) => {
      const { label, icon: Icon } = STATS[key as keyof typeof STATS];
      return (
        <div key={key} className="px-4 first:pl-0 last:pr-0 sm:px-5.5">
          <Typography.H3 className="text-blue-500 dark:text-blue-400">
            {value}
          </Typography.H3>
          <Typography.Small muted className="flex items-center gap-1">
            <Icon className="size-3.25" />
            {value === 1 ? label.slice(0, -1) : label}
          </Typography.Small>
        </div>
      );
    })}
  </div>
);
