import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeColorState {
  sideBarBackground: string;
  buttonBackground: string;
  sideBarTextColor: string;
  buttonTextColor: string;
}

const initialState: ThemeColorState = {
  sideBarBackground: "#2a3242",
  buttonBackground: "#773cbe",
  sideBarTextColor: "#94989E",
  buttonTextColor: "#FFFFFF",
};

export const themeSlice = createSlice({
  name: "themeColor",
  initialState,
  reducers: {
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
  },
});

export const {
  updateSideBarColor,
  updateButtonColor,
  updateSideBarTextColor,
  updateButtonTextColor,
} = themeSlice.actions;
export default themeSlice.reducer;
