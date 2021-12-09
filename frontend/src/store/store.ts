import { configureStore } from "@reduxjs/toolkit";
import { api } from "@src/store/reducers/api";
import themeReducer from "@src/store/reducers/themeStore";
import organizationReducer from "@src/store/reducers/organizationStore";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    myTheme: themeReducer,
    organization: organizationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
