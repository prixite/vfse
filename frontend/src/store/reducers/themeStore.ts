import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeColorState {
  sideBarBackground: string;
  buttonBackground: string;
}

const initialState: ThemeColorState = {
  sideBarBackground: "#2a3242",
  buttonBackground: "#773cbe",
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
  },
});

export const { updateSideBarColor, updateButtonColor } = themeSlice.actions;
export default themeSlice.reducer;
