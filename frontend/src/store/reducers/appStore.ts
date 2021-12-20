import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openAddClientModal: false,
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
  },
});

export const { openAddModal, closeAddModal } = appSlice.actions;
export default appSlice.reducer;
