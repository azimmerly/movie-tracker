import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { MoviesTabContent } from "@/components/movies/MoviesTabContent";
import { parsePage } from "@/utils/pagination";

type UserMoviesProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
};

const UserMovies = async ({ params, searchParams }: UserMoviesProps) => {
  const { id } = await params;
  const { search, sort, page } = await searchParams;
  const currentPage = parsePage(page);
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/movies");
  }

  return (
    <MoviesTabContent
      userId={id}
      owner={false}
      search={search}
      sort={sort}
      page={currentPage}
    />
  );
};

export default UserMovies;
