import en from "@src/localization/en.json";
import fr from "@src/localization/fr.json";

import { LocalizationInterface } from "../interfaces/localizationinterfaces";
export const localizedData = (): LocalizationInterface => {
  const lang = navigator.language;
  switch (lang) {
    case "en-US":
      return en;
    case "fr":
      return fr;
    default:
      return en;
  }
};
