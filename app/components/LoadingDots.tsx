type LoadingDotsProps = {
  className?: string;
};

export const LoadingDots = ({ className }: LoadingDotsProps) => (
  <div className={className}>
    <div className="my-12 flex w-full items-center justify-center gap-2">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 animate-bounce rounded-full bg-slate-400 [animation-delay:-200ms]" />
      <div className="h-4 w-4 animate-bounce rounded-full bg-slate-400 [animation-delay:-100ms]" />
      <div className="h-4 w-4 animate-bounce rounded-full bg-slate-400" />
    </div>
  </div>
);
