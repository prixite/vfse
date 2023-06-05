import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        systemcard: {
          "Latest Ping": "Latest Ping",
          "MPC Status": "MPC Status",
          "Is Online": "Is Online",
          "Dicom info": "Dicom info",
          "HIS/RIS info": "HIS/RIS info",
          "Helium Level": "Helium level",
          "IP adress": "IP adress",
          "Local AE title": "Local AE title",
          "Software Version": "Software Version",
          "Dashboard Link": "Dashboard Link",
          "utf-8": "utf-8",
          "SSH Terminal": "SSH Terminal",
          Comments: "Comments",
          Edit: "Edit",
          Support: "Support",
          Delete: "Delete",
          Connect: "Connect",
          Location: "Location",
          Serial: "Serial",
          Copy: "Copy",
          Asset: "Asset",
        },
      },
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
