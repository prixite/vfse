import { configureStore } from "@reduxjs/toolkit";
import AdministrationReducer from "../reducers/ThirdPartyAdministration";
export const store = configureStore({
  reducer: {
    AdminReducer: AdministrationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch