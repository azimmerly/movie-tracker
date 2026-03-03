import { twMerge } from "tailwind-merge";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export const Tooltip = ({ label, children, className }: TooltipProps) => (
  <div className={twMerge("group relative w-fit", className)}>
    {children}
    <div
      role="tooltip"
      className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-md bg-mist-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity delay-100 group-hover:opacity-100 group-hover:delay-600"
    >
      {label}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-mist-800" />
    </div>
  </div>
);
