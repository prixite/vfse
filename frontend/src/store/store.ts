import { configureStore } from "@reduxjs/toolkit";
import OrganizationReducer from "@src/reducers/Organization";

export const store = configureStore({
  reducer: {
    OrganizationReducer: OrganizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
