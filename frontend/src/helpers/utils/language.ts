import { LocalizationInterface } from "@src/types/interfaces";

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
