import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/lists");
};

export default DashboardPage;
