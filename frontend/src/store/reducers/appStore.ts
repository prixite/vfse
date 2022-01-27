import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openAddClientModal: false,
  openAddNetworkModal: false,
  openSystemNotesDrawer : false,
  systemID : undefined
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
    openSystemDrawer: (state, action) => {
      state.openSystemNotesDrawer = true;
      state.systemID = action.payload;
    },
    closeSystemDrawer: (state) => {
      state.openSystemNotesDrawer = false;
      state.systemID = undefined;
    }
  },
});

export const {
  openAddModal,
  closeAddModal,
  openNetworkModal,
  closeNetworkModal,
  openSystemDrawer,
  closeSystemDrawer
} = appSlice.actions;
export default appSlice.reducer;
