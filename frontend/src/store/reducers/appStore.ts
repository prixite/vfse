import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openAddClientModal: false,
  openAddNetworkModal: false,
};

export const appSlice = createSlice({
  name: "appStore",
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.openAddClientModal = true;
    },
    closeAddModal: (state) => {
      state.openAddClientModal = false;
    },
    openNetworkModal: (state) => {
      state.openAddNetworkModal = true;
    },
    closeNetworkModal: (state) => {
      state.openAddNetworkModal = false;
    },
  },
});

export const {
  openAddModal,
  closeAddModal,
  openNetworkModal,
  closeNetworkModal,
} = appSlice.actions;
export default appSlice.reducer;
