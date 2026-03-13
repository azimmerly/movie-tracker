import { SortSelect } from "@/components/SortSelect";

const SORT_OPTIONS = [
  { value: "added", label: "Date added" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Movie title" },
  { value: "released", label: "Release date" },
] as const;

export const MovieSortSelect = () => <SortSelect sortOptions={SORT_OPTIONS} />;
