import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../types';
import { tagApi } from '../../api/mockApi';

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async () => {
    return await tagApi.getTags();
  }
);

export const fetchTagsByType = createAsyncThunk(
  'tags/fetchTagsByType',
  async (type: 'BIN' | 'ITEM' | 'BOTH') => {
    return await tagApi.getTagsByType(type);
  }
);

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tag: Omit<Tag, 'id'>) => {
    return await tagApi.createTag(tag);
  }
);

export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    const updatedTag = await tagApi.updateTag(id, tag);
    if (!updatedTag) {
      throw new Error('Tag not found');
    }
    return updatedTag;
  }
);

export const deleteTag = createAsyncThunk(
  'tags/deleteTag',
  async (id: string) => {
    const success = await tagApi.deleteTag(id);
    if (!success) {
      throw new Error('Failed to delete tag');
    }
    return id;
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      })
      
      // fetchTagsByType
      .addCase(fetchTagsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagsByType.fulfilled, (state, action) => {
        state.loading = false;
        // We don't replace all tags, just add these to the existing array
        // avoiding duplicates
        const existingIds = new Set(state.tags.map(tag => tag.id));
        const newTags = action.payload.filter(tag => !existingIds.has(tag.id));
        state.tags = [...state.tags, ...newTags];
      })
      .addCase(fetchTagsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags by type';
      })
      
      // createTag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create tag';
      })
      
      // updateTag
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tags.findIndex(tag => tag.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update tag';
      })
      
      // deleteTag
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter(tag => tag.id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tag';
      });
  },
});

export const { setError, clearError } = tagSlice.actions;
export default tagSlice.reducer;
