const Loading = () => (
  <div className="mt-36 flex animate-pulse justify-center gap-2">
    <span className="sr-only">Loading...</span>
    <div className="size-3 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.3s] dark:bg-gray-700" />
    <div className="size-3 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.15s] dark:bg-gray-700" />
    <div className="size-3 animate-bounce rounded-full bg-gray-300 dark:bg-gray-700" />
  </div>
);

export default Loading;
