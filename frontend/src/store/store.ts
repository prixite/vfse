import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@src/store/reducers/organization";

export const store = configureStore({
  reducer: {
    OrganizationReducer: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
