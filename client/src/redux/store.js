import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/auth";
import { api } from "./api/api";
import { miscSlice } from "./reducers/misc";
import { chatSlice } from "./reducers/chat";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
