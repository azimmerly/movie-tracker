import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDate } from "@/utils/formatDate";
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
      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar size="lg" userImage={user.image} />
          <div className="w-full text-center sm:text-left">
            <Typography.Large className="leading-6">
              {user.name}
            </Typography.Large>
            <Typography.Small
              muted
              className="mt-1.5 truncate whitespace-nowrap sm:mt-0.5"
            >
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
            Joined {formatDate(user.createdAt)}
          </Typography.Small>
          <Typography.Small
            muted
            className="flex items-center gap-1 self-center sm:self-start"
          >
            <CalendarDaysIcon className="size-4" />
            Updated {formatDate(user.updatedAt)}
          </Typography.Small>
        </div>
      </Card>
    </>
  );
};

export default Account;
