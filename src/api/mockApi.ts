import { User, Room, Bin, Item, Tag } from '../types';
import { mockUser, mockRooms, mockBins, mockItems, mockTags } from './mockData';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    return mockUser;
  },
  login: async (email: string, password: string): Promise<User> => {
    await delay(1000);
    // In a real app, this would validate credentials
    return mockUser;
  },
  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(1000);
    // In a real app, this would create a new user
    return mockUser;
  },
};

// Room API
export const roomApi = {
  getRooms: async (): Promise<Room[]> => {
    await delay(500);
    return mockRooms;
  },
  getRoom: async (id: string): Promise<Room | undefined> => {
    await delay(300);
    return mockRooms.find(room => room.id === id);
  },
  createRoom: async (room: Omit<Room, 'id'>): Promise<Room> => {
    await delay(800);
    const newRoom: Room = {
      ...room,
      id: `room${mockRooms.length + 1}`,
    };
    mockRooms.push(newRoom);
    return newRoom;
  },
  updateRoom: async (id: string, room: Partial<Room>): Promise<Room | undefined> => {
    await delay(800);
    const index = mockRooms.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRooms[index] = { ...mockRooms[index], ...room };
      return mockRooms[index];
    }
    return undefined;
  },
  deleteRoom: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = mockRooms.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRooms.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Bin API
export const binApi = {
  getBins: async (): Promise<Bin[]> => {
    await delay(500);
    return mockBins;
  },
  getBin: async (id: string): Promise<Bin | undefined> => {
    await delay(300);
    return mockBins.find(bin => bin.id === id);
  },
  getBinsByParent: async (parentId: string, parentType: 'ROOM' | 'BIN'): Promise<Bin[]> => {
    await delay(500);
    return mockBins.filter(bin => bin.parentId === parentId && bin.parentType === parentType);
  },
  createBin: async (bin: Omit<Bin, 'id'>): Promise<Bin> => {
    await delay(800);
    // Generate a random 5-digit alphanumeric ID
    const generateId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    // Make sure ID is unique
    let newId = generateId();
    while (mockBins.some(b => b.id === newId)) {
      newId = generateId();
    }
    
    const newBin: Bin = {
      ...bin,
      id: newId,
    };
    mockBins.push(newBin);
    return newBin;
  },
  updateBin: async (id: string, bin: Partial<Bin>): Promise<Bin | undefined> => {
    await delay(800);
    const index = mockBins.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBins[index] = { ...mockBins[index], ...bin };
      return mockBins[index];
    }
    return undefined;
  },
  deleteBin: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = mockBins.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBins.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Item API
export const itemApi = {
  getItems: async (): Promise<Item[]> => {
    await delay(500);
    return mockItems;
  },
  getItem: async (id: string): Promise<Item | undefined> => {
    await delay(300);
    return mockItems.find(item => item.id === id);
  },
  getItemsByBin: async (binId: string): Promise<Item[]> => {
    await delay(500);
    return mockItems.filter(item => item.binId === binId);
  },
  createItem: async (item: Omit<Item, 'id'>): Promise<Item> => {
    await delay(800);
    const newItem: Item = {
      ...item,
      id: `item${mockItems.length + 1}`,
    };
    mockItems.push(newItem);
    return newItem;
  },
  updateItem: async (id: string, item: Partial<Item>): Promise<Item | undefined> => {
    await delay(800);
    const index = mockItems.findIndex(i => i.id === id);
    if (index !== -1) {
      mockItems[index] = { ...mockItems[index], ...item };
      return mockItems[index];
    }
    return undefined;
  },
  deleteItem: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = mockItems.findIndex(i => i.id === id);
    if (index !== -1) {
      mockItems.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Tag API
export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    await delay(500);
    return mockTags;
  },
  getTag: async (id: string): Promise<Tag | undefined> => {
    await delay(300);
    return mockTags.find(tag => tag.id === id);
  },
  getTagsByType: async (type: 'BIN' | 'ITEM' | 'BOTH'): Promise<Tag[]> => {
    await delay(500);
    return mockTags.filter(tag => tag.type === type || tag.type === 'BOTH');
  },
  createTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
    await delay(800);
    const newTag: Tag = {
      ...tag,
      id: `tag${mockTags.length + 1}`,
    };
    mockTags.push(newTag);
    return newTag;
  },
  updateTag: async (id: string, tag: Partial<Tag>): Promise<Tag | undefined> => {
    await delay(800);
    const index = mockTags.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTags[index] = { ...mockTags[index], ...tag };
      return mockTags[index];
    }
    return undefined;
  },
  deleteTag: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = mockTags.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTags.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Search API
export const searchApi = {
  search: async (query: string): Promise<{ rooms: Room[], bins: Bin[], items: Item[] }> => {
    await delay(800);
    const normalizedQuery = query.toLowerCase();
    
    const rooms = mockRooms.filter(room => 
      room.name.toLowerCase().includes(normalizedQuery) || 
      (room.notes && room.notes.toLowerCase().includes(normalizedQuery))
    );
    
    const bins = mockBins.filter(bin => 
      bin.name.toLowerCase().includes(normalizedQuery) || 
      bin.id.toLowerCase().includes(normalizedQuery) || 
      bin.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) || 
      (bin.notes && bin.notes.toLowerCase().includes(normalizedQuery))
    );
    
    const items = mockItems.filter(item => 
      item.name.toLowerCase().includes(normalizedQuery) || 
      item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) || 
      (item.notes && item.notes.toLowerCase().includes(normalizedQuery))
    );
    
    return { rooms, bins, items };
  },
};
