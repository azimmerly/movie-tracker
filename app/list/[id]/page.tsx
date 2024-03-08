import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { List } from "./components";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type ListPageProps = {
  params: {
    id: string;
  };
};

const ListPage = async ({ params }: ListPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="mt-12 flex flex-col gap-4 sm:mt-20">
      <List id={params.id} />
    </div>
  );
};

export default ListPage;
