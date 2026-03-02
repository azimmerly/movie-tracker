import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { DashboardTabs } from "@/components/DashboardTabs";
import { Typography } from "@/components/ui/Typography";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-8">
      <Typography.H1>My Dashboard</Typography.H1>
      <DashboardTabs basePath="/dashboard" />
      {children}
    </div>
  );
};

export default DashboardLayout;
