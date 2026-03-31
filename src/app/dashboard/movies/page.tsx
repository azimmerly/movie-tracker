import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { MoviesTabContent } from "@/components/movies/MoviesTabContent";

type MyMoviesProps = {
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const MyMovies = async ({ searchParams }: MyMoviesProps) => {
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <MoviesTabContent
      userId={session.user.id}
      owner={true}
      search={search}
      sort={sort}
    />
  );
};

export default MyMovies;
