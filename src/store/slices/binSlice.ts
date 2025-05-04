import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bin } from '../../types';
import { binApi } from '../../api/mockApi';

interface BinState {
  bins: Bin[];
  currentBin: Bin | null;
  loading: boolean;
  error: string | null;
}

const initialState: BinState = {
  bins: [],
  currentBin: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBins = createAsyncThunk(
  'bins/fetchBins',
  async () => {
    return await binApi.getBins();
  }
);

export const fetchBin = createAsyncThunk(
  'bins/fetchBin',
  async (id: string) => {
    const bin = await binApi.getBin(id);
    if (!bin) {
      throw new Error('Bin not found');
    }
    return bin;
  }
);

export const fetchBinsByParent = createAsyncThunk(
  'bins/fetchBinsByParent',
  async ({ parentId, parentType }: { parentId: string; parentType: 'ROOM' | 'BIN' }) => {
    return await binApi.getBinsByParent(parentId, parentType);
  }
);

export const createBin = createAsyncThunk(
  'bins/createBin',
  async (bin: Omit<Bin, 'id'>) => {
    return await binApi.createBin(bin);
  }
);

export const updateBin = createAsyncThunk(
  'bins/updateBin',
  async ({ id, bin }: { id: string; bin: Partial<Bin> }) => {
    const updatedBin = await binApi.updateBin(id, bin);
    if (!updatedBin) {
      throw new Error('Bin not found');
    }
    return updatedBin;
  }
);

export const deleteBin = createAsyncThunk(
  'bins/deleteBin',
  async (id: string) => {
    const success = await binApi.deleteBin(id);
    if (!success) {
      throw new Error('Failed to delete bin');
    }
    return id;
  }
);

const binSlice = createSlice({
  name: 'bins',
  initialState,
  reducers: {
    clearCurrentBin: (state) => {
      state.currentBin = null;
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
      // fetchBins
      .addCase(fetchBins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBins.fulfilled, (state, action) => {
        state.loading = false;
        state.bins = action.payload;
      })
      .addCase(fetchBins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bins';
      })
      
      // fetchBin
      .addCase(fetchBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBin = action.payload;
      })
      .addCase(fetchBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bin';
      })
      
      // fetchBinsByParent
      .addCase(fetchBinsByParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBinsByParent.fulfilled, (state, action) => {
        state.loading = false;
        // We don't replace all bins, just add these to the existing array
        // avoiding duplicates
        const existingIds = new Set(state.bins.map(bin => bin.id));
        const newBins = action.payload.filter(bin => !existingIds.has(bin.id));
        state.bins = [...state.bins, ...newBins];
      })
      .addCase(fetchBinsByParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bins by parent';
      })
      
      // createBin
      .addCase(createBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBin.fulfilled, (state, action) => {
        state.loading = false;
        state.bins.push(action.payload);
      })
      .addCase(createBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create bin';
      })
      
      // updateBin
      .addCase(updateBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bins.findIndex(bin => bin.id === action.payload.id);
        if (index !== -1) {
          state.bins[index] = action.payload;
        }
        if (state.currentBin && state.currentBin.id === action.payload.id) {
          state.currentBin = action.payload;
        }
      })
      .addCase(updateBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update bin';
      })
      
      // deleteBin
      .addCase(deleteBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBin.fulfilled, (state, action) => {
        state.loading = false;
        state.bins = state.bins.filter(bin => bin.id !== action.payload);
        if (state.currentBin && state.currentBin.id === action.payload) {
          state.currentBin = null;
        }
      })
      .addCase(deleteBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete bin';
      });
  },
});

export const { clearCurrentBin, setError, clearError } = binSlice.actions;
export default binSlice.reducer;
