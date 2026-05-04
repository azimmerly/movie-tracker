export const logError = (context: string, error: unknown) => {
  console.error(`[${context}]`, error);
};
