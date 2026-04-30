export const formatRuntime = (runtime: number) => {
  const segments: string[] = [];
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours) {
    segments.push(`${hours}hr`);
  }
  if (minutes) {
    segments.push(`${minutes}min`);
  }

  return segments.join(" ");
};
