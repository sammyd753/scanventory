import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../types';
import { itemApi } from '../../api/mockApi';

interface ItemState {
  items: Item[];
  currentItem: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async () => {
    return await itemApi.getItems();
  }
);

export const fetchItem = createAsyncThunk(
  'items/fetchItem',
  async (id: string) => {
    const item = await itemApi.getItem(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }
);

export const fetchItemsByBin = createAsyncThunk(
  'items/fetchItemsByBin',
  async (binId: string) => {
    return await itemApi.getItemsByBin(binId);
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (item: Omit<Item, 'id'>) => {
    return await itemApi.createItem(item);
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, item }: { id: string; item: Partial<Item> }) => {
    const updatedItem = await itemApi.updateItem(id, item);
    if (!updatedItem) {
      throw new Error('Item not found');
    }
    return updatedItem;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string) => {
    const success = await itemApi.deleteItem(id);
    if (!success) {
      throw new Error('Failed to delete item');
    }
    return id;
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
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
      // fetchItems
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      
      // fetchItem
      .addCase(fetchItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch item';
      })
      
      // fetchItemsByBin
      .addCase(fetchItemsByBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemsByBin.fulfilled, (state, action) => {
        state.loading = false;
        // We don't replace all items, just add these to the existing array
        // avoiding duplicates
        const existingIds = new Set(state.items.map(item => item.id));
        const newItems = action.payload.filter(item => !existingIds.has(item.id));
        state.items = [...state.items, ...newItems];
      })
      .addCase(fetchItemsByBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items by bin';
      })
      
      // createItem
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      })
      
      // updateItem
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem && state.currentItem.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      })
      
      // deleteItem
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem && state.currentItem.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const { clearCurrentItem, setError, clearError } = itemSlice.actions;
export default itemSlice.reducer;
