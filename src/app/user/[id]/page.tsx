import { redirect } from "next/navigation";

type UserPageProps = {
  params: Promise<{ id: string }>;
};

const UserPage = async ({ params }: UserPageProps) => {
  const { id } = await params;
  redirect(`/user/${id}/lists`);
};

export default UserPage;
