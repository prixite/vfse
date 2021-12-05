import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@src/store/reducers/organizationSlice";
import { api } from "@src/store/reducers/api";

export const store = configureStore({
  reducer: {
    organizationReducer: organizationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
