import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeColor",
  initialState: {
    sideBarBackground: "#2a3242",
    buttonBackground: "#773cbe"
  },
  reducers: {
    updateSideBarColor: (state, action) => {
      state.sideBarBackground = action.payload.color
    },
    updateButtonColor: (state, action) => {
      state.buttonBackground = action.payload.color
    }
  }
});

export const { updateSideBarColor, updateButtonColor } = themeSlice.actions;
export default themeSlice.reducer;