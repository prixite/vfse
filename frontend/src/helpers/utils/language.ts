import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";

export const localizedData = (): LocalizationInterface => {
  const lang = navigator.language;
  switch (lang) {
    case "en-US":
      return;
    case "fr":
      return;
    default:
      return;
  }
};
