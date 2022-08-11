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
    updateSecondaryColor: (state, action: PayloadAction<string>) => {
      state.secondaryColor = action.payload;
    },
    updateSideBarColor: (state, action: PayloadAction<string>) => {
      state.sideBarBackground = action.payload;
    },
    updateButtonColor: (state, action: PayloadAction<string>) => {
      state.buttonBackground = action.payload;
    },
    updateSideBarTextColor: (state, action: PayloadAction<string>) => {
      state.sideBarTextColor = action.payload;
    },
    updateButtonTextColor: (state, action: PayloadAction<string>) => {
      state.buttonTextColor = action.payload;
    },
    updateFontOne: (state, action: PayloadAction<string>) => {
      state.fontOne = action.payload;
    },
    updateFontTwo: (state, action: PayloadAction<string>) => {
      state.fontTwo = action.payload;
    },
    updateTheme: (state, action: PayloadAction<ThemeColorState>) => {
      state.sideBarBackground = action.payload.sideBarBackground;
      state.sideBarTextColor = action.payload.sideBarTextColor;
      state.buttonBackground = action.payload.buttonBackground;
      state.buttonTextColor = action.payload.buttonTextColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.fontOne = action.payload.fontOne;
      state.fontTwo = action.payload.fontTwo;
    },
  },
});

export const {
  updateSideBarColor,
  updateButtonColor,
  updateSideBarTextColor,
  updateButtonTextColor,
  updateFontOne,
  updateFontTwo,
  updateSecondaryColor,
  updateTheme,
} = themeSlice.actions;
export default themeSlice.reducer;
