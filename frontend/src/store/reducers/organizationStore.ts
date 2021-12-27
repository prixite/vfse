import { createSlice } from "@reduxjs/toolkit";

import { Organization } from "@src/store/reducers/api";

interface OrganizationState {
  currentOrganization: Organization;
  selectedOrganization: Organization;
}

const initialState: OrganizationState = {
  currentOrganization: null,
  selectedOrganization: null,
};

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload.currentOrganization;
    },
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload.selectedOrganization;
    },
  },
});

export const { setCurrentOrganization, setSelectedOrganization } =
  organizationSlice.actions;
export default organizationSlice.reducer;
