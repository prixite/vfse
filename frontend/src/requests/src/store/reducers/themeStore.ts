import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeColorState {
  sideBarBackground: string;
  buttonBackground: string;
  sideBarTextColor: string;
  buttonTextColor: string;
  secondaryColor: string;
  fontOne: string;
  fontTwo: string;
}

const initialState: ThemeColorState = {
  sideBarBackground: "#2a3242",
  buttonBackground: "#773cbe",
  sideBarTextColor: "#94989E",
  buttonTextColor: "#FFFFFF",
  secondaryColor: "#EFE1FF",
  fontOne: "helvetica",
  fontTwo: "calibri",
};

export const themeSlice = createSlice({
  name: "themeColor",
  initialState,
  reducers: {
  },
});

export default themeSlice.reducer;
