const Loading = () => (
  <div className="flex flex-1 animate-pulse items-center justify-center gap-3">
    <span className="sr-only">Loading...</span>
    <div className="size-3 animate-bounce rounded-full bg-mist-200 [animation-delay:-0.3s] dark:bg-mist-700" />
    <div className="size-3 animate-bounce rounded-full bg-mist-200 [animation-delay:-0.15s] dark:bg-mist-700" />
    <div className="size-3 animate-bounce rounded-full bg-mist-200 dark:bg-mist-700" />
  </div>
);

export default Loading;
