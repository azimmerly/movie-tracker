import { StarIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

import { getUserMovieStats } from "@/actions/user";
import { ErrorMessage } from "@/components/ErrorMessage";
import { StatBarList } from "@/components/dashboard/StatBarList";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

type StatsTabContentProps = {
  userId: string;
};

export const StatsTabContent = async ({ userId }: StatsTabContentProps) => {
  const { data, success } = await getUserMovieStats(userId);

  if (!success || !data) {
    return <ErrorMessage />;
  }

  const { genreRatingStats } = data;

  return (
    <div className="mt-2">
      <Card className="p-4 sm:max-w-1/2 sm:p-5">
        <Typography.Body className="mb-3 font-semibold">
          Top Genres by Rating
        </Typography.Body>
        {!!genreRatingStats.length ? (
          <StatBarList
            items={genreRatingStats.map(({ genre, avg, count }) => ({
              label: genre,
              value: (
                <span className="flex items-center gap-1">
                  <StarIcon className="size-3.75 text-amber-400" />
                  {avg.toFixed(1)}
                </span>
              ),
              percent: (avg / 5) * 100,
              description: `${count} film${count !== 1 ? "s" : ""}`,
            }))}
          />
        ) : (
          <Typography.Small muted className="flex items-center gap-1.25">
            <InformationCircleIcon className="size-4 shrink-0 text-mist-400" />
            Add more ratings to see your top genres
          </Typography.Small>
        )}
      </Card>
    </div>
  );
};
