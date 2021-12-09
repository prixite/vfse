import { createSlice } from "@reduxjs/toolkit";
import { Me } from "@src/store/reducers/api";

interface MeState {
  me: Me;
}

const initialState: MeState = { me: {} };

export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    updateMe: (state, action) => {
      state.me = action.payload;
    },
  },
});

export const { updateMe } = meSlice.actions;
export default meSlice.reducer;
