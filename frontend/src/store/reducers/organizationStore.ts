import { createSlice } from "@reduxjs/toolkit";
import { Organization } from "@src/store/reducers/api";

interface OrganizationState {
  currentOrganization: Organization;
}

const initialState: OrganizationState = { currentOrganization: null };

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload.currentOrganiation;
    },
  },
});

export const { setCurrentOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
