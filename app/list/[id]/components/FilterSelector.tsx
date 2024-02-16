type FilterSelectorProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

export const FilterSelector = ({ filter, setFilter }: FilterSelectorProps) => {
  const isSelected = (value: string) => value === filter;

  const filters = [
    { value: "all", label: "View all" },
    { value: "favorite", label: "Favorite" },
    { value: "watched", label: "Watched" },
  ] as const;

  return (
    <div className="mt-4 flex w-fit self-center overflow-hidden rounded-full border font-medium text-slate-700 shadow-sm sm:mt-6 sm:self-start">
      {filters.map(({ value, label }) => {
        const borderStyle = value !== "watched" && "border-r";
        const currentStyle = isSelected(value)
          ? "bg-slate-50 text-indigo-600"
          : "bg-white";

        return (
          <div key={value} className={`${currentStyle} flex`}>
            <input
              className="hidden"
              type="radio"
              id={value}
              value={value}
              onChange={(e) => setFilter(e.target.value)}
              checked={isSelected(value)}
            />
            <label
              htmlFor={value}
              className={`${borderStyle} flex cursor-pointer justify-center px-4 py-2 text-sm transition hover:bg-slate-100`}
            >
              {label}
            </label>
          </div>
        );
      })}
    </div>
  );
};
