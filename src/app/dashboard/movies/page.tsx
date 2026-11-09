import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { MoviesTabContent } from "@/components/movies/MoviesTabContent";
import { parsePage } from "@/utils/pagination";

type MyMoviesProps = {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const MyMovies = async ({ searchParams }: MyMoviesProps) => {
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
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
      page={currentPage}
    />
  );
};

export default MyMovies;
