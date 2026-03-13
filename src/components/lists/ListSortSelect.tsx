import { SortSelect } from "@/components/SortSelect";

const SORT_OPTIONS = [
  { value: "created", label: "Date created" },
  { value: "title", label: "List title" },
  { value: "count", label: "Movie count" },
] as const;

export const ListSortSelect = () => <SortSelect sortOptions={SORT_OPTIONS} />;
