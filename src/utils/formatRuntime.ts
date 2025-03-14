export const formatRuntime = (runtime: number) => {
  let result = "";

  const hours = Math.floor(runtime / 60);
  if (hours > 0) {
    result += `${hours} hr`;
  }

  const minutes = runtime % 60;
  if (minutes > 0) {
    result += ` ${minutes} min`;
  }

  return result;
};
