const Loading = () => (
  <div className="flex flex-1 animate-pulse items-center justify-center gap-3">
    <span className="sr-only">Loading...</span>
    <div className="size-3 animate-bounce rounded-full bg-gray-200 [animation-delay:-0.3s] dark:bg-gray-800" />
    <div className="size-3 animate-bounce rounded-full bg-gray-200 [animation-delay:-0.15s] dark:bg-gray-800" />
    <div className="size-3 animate-bounce rounded-full bg-gray-200 dark:bg-gray-800" />
  </div>
);

export default Loading;
