import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room, Bin, Item } from '../../types';
import { searchApi } from '../../api/mockApi';

interface SearchState {
  query: string;
  results: {
    rooms: Room[];
    bins: Bin[];
    items: Item[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: {
    rooms: [],
    bins: [],
    items: [],
  },
  loading: false,
  error: null,
};

// Async thunks
export const searchItems = createAsyncThunk(
  'search/searchItems',
  async (query: string) => {
    return await searchApi.search(query);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = {
        rooms: [],
        bins: [],
        items: [],
      };
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search items';
      });
  },
});

export const { setQuery, clearResults, setError, clearError } = searchSlice.actions;
export default searchSlice.reducer;
