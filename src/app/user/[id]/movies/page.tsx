import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { MoviesTabContent } from "@/components/movies/MoviesTabContent";

type UserMoviesProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
};

const UserMovies = async ({ params, searchParams }: UserMoviesProps) => {
  const { id } = await params;
  const { search, sort } = await searchParams;
  const session = await getSession();

  if (id === session?.user.id) {
    redirect("/dashboard/movies");
  }

  return (
    <MoviesTabContent userId={id} owner={false} search={search} sort={sort} />
  );
};

export default UserMovies;
