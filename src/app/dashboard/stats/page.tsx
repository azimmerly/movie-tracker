import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { StatsTabContent } from "@/components/dashboard/StatsTabContent";

const MyStats = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <StatsTabContent userId={session.user.id} />;
};

export default MyStats;
