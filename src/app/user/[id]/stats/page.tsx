import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { StatsTabContent } from "@/components/dashboard/StatsTabContent";

type UserStatsProps = {
  params: Promise<{ id: string }>;
};

const UserStats = async ({ params }: UserStatsProps) => {
  const { id } = await params;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/stats");
  }

  return <StatsTabContent userId={id} />;
};

export default UserStats;
