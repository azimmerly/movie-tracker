type TooltipProps = {
  tooltip: string;
  children: React.ReactNode;
};

export const ToolTip = ({ children, tooltip }: TooltipProps) => (
  <div className="group relative inline-block">
    {children}
    <span className="invisible absolute right-0 top-full mt-2 w-fit rounded-lg bg-white px-3 py-1 text-sm font-medium text-slate-700 opacity-0 shadow transition group-hover:visible group-hover:opacity-100">
      {tooltip}
    </span>
  </div>
);
