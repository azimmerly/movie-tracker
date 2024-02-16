export const isValidListTitle = (listTitle: string) => {
  return listTitle.trim().length <= 40 && listTitle.trim().length > 0;
};

export const isValidSearch = (movieTitle: string) => {
  return !!movieTitle.trim().length;
};
