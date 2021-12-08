import { createSlice } from "@reduxjs/toolkit";

export const organizationSlice = createSlice({
  name: "currentOrganization",
  initialState: {
    current_organization : {}
  },
  reducers: {
    updateCurrentOrganization: (state, action) => {
      state.current_organization = action.payload.data;
    },
  }
});

export const { updateCurrentOrganization} = organizationSlice.actions;
export default organizationSlice.reducer;