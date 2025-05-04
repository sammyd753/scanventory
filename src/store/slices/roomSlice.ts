import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../types';
import { roomApi } from '../../api/mockApi';

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async () => {
    return await roomApi.getRooms();
  }
);

export const fetchRoom = createAsyncThunk(
  'rooms/fetchRoom',
  async (id: string) => {
    const room = await roomApi.getRoom(id);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (room: Omit<Room, 'id'>) => {
    return await roomApi.createRoom(room);
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, room }: { id: string; room: Partial<Room> }) => {
    const updatedRoom = await roomApi.updateRoom(id, room);
    if (!updatedRoom) {
      throw new Error('Room not found');
    }
    return updatedRoom;
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: string) => {
    const success = await roomApi.deleteRoom(id);
    if (!success) {
      throw new Error('Failed to delete room');
    }
    return id;
  }
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
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
      // fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      })
      
      // fetchRoom
      .addCase(fetchRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch room';
      })
      
      // createRoom
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create room';
      })
      
      // updateRoom
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
        if (state.currentRoom && state.currentRoom.id === action.payload.id) {
          state.currentRoom = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update room';
      })
      
      // deleteRoom
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
        if (state.currentRoom && state.currentRoom.id === action.payload) {
          state.currentRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete room';
      });
  },
});

export const { clearCurrentRoom, setError, clearError } = roomSlice.actions;
export default roomSlice.reducer;
