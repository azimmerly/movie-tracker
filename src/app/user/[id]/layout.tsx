import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";

import { getUserById } from "@/actions/user";
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
  const { data: user, success } = await getUserById(id);

  if (!user || !success) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar userImage={user.image} className="size-9" />
          <div className="flex items-baseline gap-1.5">
            <Typography.H2>{user.name}</Typography.H2>
            <Typography.H3 muted className="font-light">
              {formatUserId(user.id)}
            </Typography.H3>
          </div>
        </div>
        <Typography.Small className="flex items-center gap-1" muted>
          <CalendarDaysIcon className="size-4.5" />
          <span className="font-medium">Joined: </span>
          {formatDate(user.createdAt)}
        </Typography.Small>
      </div>
      <DashboardTabs basePath={`/user/${id}`} />
      {children}
    </div>
  );
};

export default UserLayout;
