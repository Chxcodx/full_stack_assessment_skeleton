import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./api/user-slice";
import homeReducer from "./api/home-slice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    home: homeReducer,
  },
});

export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
