import { configureStore } from "@reduxjs/toolkit";

import { api } from "@src/store/reducers/api";
import appReducer from "@src/store/reducers/appStore";
import organizationReducer from "@src/store/reducers/organizationStore";
import themeReducer from "@src/store/reducers/themeStore";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    myTheme: themeReducer,
    organization: organizationReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
