import en from "@src/localization/en.json";
import fr from "@src/localization/fr.json";

export const localizedData = () => {
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
