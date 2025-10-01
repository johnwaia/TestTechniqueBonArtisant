import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  username: typeof localStorage !== 'undefined' ? localStorage.getItem('lastUsername') : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token ?? null;
      state.username = action.payload.username ?? null;
      if (typeof localStorage !== 'undefined') {
        if (state.token) localStorage.setItem('token', state.token); else localStorage.removeItem('token');
        if (state.username) localStorage.setItem('lastUsername', state.username); else localStorage.removeItem('lastUsername');
      }
    },
    clearAuth(state) {
      state.token = null;
      state.username = null;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('lastUsername');
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
