import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const organizationSlice = createSlice({
  name: "Organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrganizationData } = organizationSlice.actions;
export default organizationSlice.reducer;
