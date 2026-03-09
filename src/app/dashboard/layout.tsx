import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { getUserStats } from "@/actions/user";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardTabs } from "@/components/DashboardTabs";
import { Typography } from "@/components/ui/Typography";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: stats } = await getUserStats(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>My Dashboard</Typography.H1>
      {stats && <DashboardStats stats={stats} />}
      <hr className="border-mist-200 sm:mt-1 dark:border-mist-700" />
      <DashboardTabs basePath="/dashboard" />
      {children}
    </div>
  );
};

export default DashboardLayout;
