import { StarIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

import { getUserMovieStats } from "@/actions/user";
import { ErrorMessage } from "@/components/ErrorMessage";
import { StatBarList } from "@/components/dashboard/StatBarList";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

const EmptyState = ({ message }: { message: string }) => (
  <Typography.Small muted className="mt-2 flex items-center gap-1.25">
    <InformationCircleIcon className="size-4 shrink-0 text-mist-400" />
    {message}
  </Typography.Small>
);

type StatsTabContentProps = {
  userId: string;
};

export const StatsTabContent = async ({ userId }: StatsTabContentProps) => {
  const { data, success } = await getUserMovieStats(userId);

  if (!success || !data) {
    return <ErrorMessage />;
  }

  const { genreRatingStats, genreCountStats, decadeStats } = data;

  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2">
      <Card className="p-4 sm:p-6">
        <Typography.Body className="mb-3 font-semibold">
          Top Genres by Rating
        </Typography.Body>
        {!!genreRatingStats.length ? (
          <StatBarList
            color="amber"
            items={genreRatingStats.map(({ genre, avg, count }) => ({
              label: genre,
              value: avg.toFixed(1),
              icon: (
                <StarIcon className="size-3.75 text-amber-400 dark:text-amber-500" />
              ),
              percent: (avg / 5) * 100,
              description: `${count} film${count !== 1 ? "s" : ""}`,
            }))}
          />
        ) : (
          <EmptyState message="Add more ratings to see your top genres" />
        )}
      </Card>
      <Card className="p-4 sm:p-6">
        <Typography.Body className="mb-3 font-semibold">
          Top Genres by Count
        </Typography.Body>
        {!!genreCountStats.length ? (
          <StatBarList
            color="emerald"
            items={genreCountStats.map(({ genre, count, avg }, _, arr) => ({
              label: genre,
              value: `${count} film${count !== 1 ? "s" : ""}`,
              percent: (count / arr[0].count) * 100,
              description: !!avg
                ? `${avg.toFixed(1)} avg rating`
                : "No ratings yet",
            }))}
          />
        ) : (
          <EmptyState message="Add movies to see your top genres" />
        )}
      </Card>
      <Card className="p-4 sm:col-span-2 sm:p-6">
        <Typography.Body className="mb-3 font-semibold">
          Movies by Decade
        </Typography.Body>
        {!!decadeStats.length ? (
          <StatBarList
            color="violet"
            items={decadeStats.map(({ decade, count, percent, avg }) => ({
              label: decade === 1950 ? "Pre-1960s" : `${decade}s`,
              value: `${count} film${count !== 1 ? "s" : ""}`,
              percent,
              description: !!avg
                ? `${avg.toFixed(1)} avg rating`
                : "No ratings yet",
            }))}
          />
        ) : (
          <EmptyState message="Add movies to see your decades" />
        )}
      </Card>
    </div>
  );
};
