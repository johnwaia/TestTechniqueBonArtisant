import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] },
  reducers: {
    setProducts(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    upsertProduct(state, action) {
      const p = action.payload;
      const id = p?._id || p?.id;
      if (!id) return;
      const idx = state.items.findIndex(x => (x._id || x.id) === id);
      if (idx === -1) state.items.unshift(p);
      else state.items[idx] = p;
    },
    removeProduct(state, action) {
      const id = action.payload;
      state.items = state.items.filter(x => (x._id || x.id) !== id);
    },
  },
});

export const { setProducts, upsertProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
