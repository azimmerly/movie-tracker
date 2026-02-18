export const formatLanguage = (languageCode: string) => {
  const formattedLanguage = new Intl.DisplayNames(["en"], {
    type: "language",
  }).of(languageCode);
  return formattedLanguage ?? languageCode;
};
