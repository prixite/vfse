import { createSlice } from "@reduxjs/toolkit";

export const meSlice = createSlice({
  name: "me",
  initialState: {
    me : {}
  },
  reducers: {
    updateMe: (state, action) => {
      state.me = action.payload;
    },
  }
});

export const { updateMe } = meSlice.actions;
export default meSlice.reducer;
