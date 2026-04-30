const displayNames = new Intl.DisplayNames(["en"], { type: "language" });

export const formatLanguage = (languageCode: string) =>
  displayNames.of(languageCode) ?? languageCode;
