import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@src/store/reducers/organization";
import { api } from "@src/store/reducers/api";

export const store = configureStore({
  reducer: {
    organizationReducer: organizationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
