import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
      state.isLoading = false;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
