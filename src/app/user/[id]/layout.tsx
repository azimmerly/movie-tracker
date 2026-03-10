import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";

import { getUserById, getUserStats } from "@/actions/user";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardTabs } from "@/components/DashboardTabs";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { formatUserId } from "@/utils/formatUserId";

const UserLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [{ data: user, success }, { data: stats }] = await Promise.all([
    getUserById(id),
    getUserStats(id),
  ]);

  if (!user || !success) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2">
          <Avatar userImage={user.image} className="size-7.5 sm:size-9" />
          <div className="flex items-end gap-1.5">
            <Typography.H2>{user.name}</Typography.H2>
            <Typography.Large muted className="font-light sm:text-[19px]">
              {formatUserId(user.id)}
            </Typography.Large>
          </div>
        </div>
        <Typography.Small className="flex items-center gap-1" muted>
          <CalendarDaysIcon className="size-4" />
          Joined {formatDate(user.createdAt)}
        </Typography.Small>
      </div>
      {stats && <DashboardStats stats={stats} />}
      <hr className="border-mist-200 dark:border-mist-700" />
      <DashboardTabs basePath={`/user/${id}`} />
      {children}
    </div>
  );
};

export default UserLayout;
