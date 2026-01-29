import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
import { formatUserId } from "@/utils/formatUserId";
import { OptionsDropdown } from "./OptionsDropdown";

const Account = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Typography.H1>My Account</Typography.H1>
        <OptionsDropdown user={user} />
      </div>
      <Card className="py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar size="xl" userImage={user.image} />
          <div className="flex w-full flex-col gap-0.5 text-center sm:text-left">
            <div className="flex justify-center gap-1.5 sm:justify-start">
              <Typography.Large>{user.name}</Typography.Large>
              <Typography.Large muted className="font-normal">
                {formatUserId(user.id)}
              </Typography.Large>
            </div>
            <Typography.Small muted className="truncate whitespace-nowrap">
              {user.email}
            </Typography.Small>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-1">
          <Typography.Small
            muted
            className="flex items-center gap-1 self-center sm:self-start"
          >
            <CalendarDaysIcon className="size-4" />
            <span className="font-medium">Joined: </span>
            {formatDate(user.createdAt)}
          </Typography.Small>
          <Typography.Small
            muted
            className="flex items-center gap-1 self-center sm:self-start"
          >
            <CalendarDaysIcon className="size-4" />
            <span className="font-medium">Updated: </span>
            {formatDate(user.updatedAt)}
          </Typography.Small>
        </div>
      </Card>
    </>
  );
};

export default Account;
