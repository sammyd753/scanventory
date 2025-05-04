import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './slices/roomSlice';
import binReducer from './slices/binSlice';
import itemReducer from './slices/itemSlice';
import tagReducer from './slices/tagSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    rooms: roomReducer,
    bins: binReducer,
    items: itemReducer,
    tags: tagReducer,
    search: searchReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
