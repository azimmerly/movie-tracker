import {
  FilmIcon,
  HeartIcon,
  ListBulletIcon,
  StarIcon,
} from "@heroicons/react/16/solid";

import { Typography } from "@/components/ui/Typography";

const STATS = {
  totalLists: {
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
  totalFavorites: {
    label: "Favorites",
    icon: HeartIcon,
  },
} as const;

type DashboardStatsProps = {
  stats: Record<keyof typeof STATS, number>;
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="-my-1 w-full overflow-x-auto [scrollbar-width:none] sm:mb-1 [&::-webkit-scrollbar]:hidden">
    <div className="flex w-fit divide-x divide-mist-200 dark:divide-mist-700">
      {Object.entries(stats).map(([key, value]) => {
        const { label, icon: Icon } = STATS[key as keyof typeof STATS];
        return (
          <div key={key} className="px-3 first:pl-0 last:pr-0 sm:px-4.5">
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
  </div>
);
