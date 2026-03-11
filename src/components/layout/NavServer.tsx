import { getSession } from "@/actions/auth";
import { NavClient } from "@/components/layout/NavClient";

export const NavServer = async () => {
  const session = await getSession();

  return (
    <header className="w-screen">
      <NavClient user={session?.user} />
    </header>
  );
};
