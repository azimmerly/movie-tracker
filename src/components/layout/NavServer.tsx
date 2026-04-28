import { getSession } from "@/actions/auth";
import { NavClient } from "@/components/layout/NavClient";

export const NavServer = async () => {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mist-200 bg-white dark:border-mist-800 dark:bg-mist-950">
      <NavClient user={session?.user} />
    </header>
  );
};
