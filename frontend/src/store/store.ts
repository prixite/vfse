import { configureStore } from "@reduxjs/toolkit";
import OrganizationReducer from "@src/store/reducers/Organization";
import { api } from "@src/store/api";

export const store = configureStore({
  reducer: {
    OrganizationReducer: OrganizationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
