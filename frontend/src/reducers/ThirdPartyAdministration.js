import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const counterSlice = createSlice({
  name: "thirdPartyAdministration",
  initialState,
  reducers: {
    setAdministrationData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAdministrationData } = counterSlice.actions;
export default counterSlice.reducer;
