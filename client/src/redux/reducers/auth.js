import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
    },

    userDoesNotExist: (state) => {
      state.user = null;
    },
  },
});

export const { userExists, userDoesNotExist } = authSlice.actions;

export { authSlice };
