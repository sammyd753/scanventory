import { User, Room, Bin, Item, Tag } from '../types';

// Mock user
export const mockUser: User = {
  id: 'user1',
  email: 'user@example.com',
  name: 'Test User',
};

// Mock rooms
export const mockRooms: Room[] = [
  {
    id: 'room1',
    name: 'Living Room',
    userId: 'user1',
    notes: 'Main living area',
  },
  {
    id: 'room2',
    name: 'Garage',
    userId: 'user1',
    notes: 'Storage and workshop',
  },
  {
    id: 'room3',
    name: 'Basement',
    userId: 'user1',
    notes: 'Long term storage',
  },
];

// Mock bins
export const mockBins: Bin[] = [
  {
    id: 'A1B2C',
    name: 'Electronics',
    parentId: 'room1',
    parentType: 'ROOM',
    tags: ['electronics', 'valuable'],
    notes: 'Contains various electronic devices',
    userId: 'user1',
  },
  {
    id: 'D3E4F',
    name: 'Books',
    parentId: 'room1',
    parentType: 'ROOM',
    tags: ['books', 'media'],
    notes: 'Fiction and non-fiction books',
    userId: 'user1',
  },
  {
    id: 'G5H6I',
    name: 'Tools',
    parentId: 'room2',
    parentType: 'ROOM',
    tags: ['tools', 'hardware'],
    notes: 'Hand tools and power tools',
    userId: 'user1',
  },
  {
    id: 'J7K8L',
    name: 'Screwdrivers',
    parentId: 'G5H6I',
    parentType: 'BIN',
    tags: ['tools', 'hardware'],
    notes: 'Various screwdrivers',
    userId: 'user1',
  },
  {
    id: 'M9N0P',
    name: 'Holiday Decorations',
    parentId: 'room3',
    parentType: 'ROOM',
    tags: ['seasonal', 'decorations'],
    notes: 'Christmas, Halloween, etc.',
    userId: 'user1',
  },
];

// Mock items
export const mockItems: Item[] = [
  {
    id: 'item1',
    name: 'Laptop',
    binId: 'A1B2C',
    quantity: 1,
    tags: ['electronics', 'work'],
    notes: 'Dell XPS 15',
    userId: 'user1',
  },
  {
    id: 'item2',
    name: 'Tablet',
    binId: 'A1B2C',
    quantity: 1,
    tags: ['electronics', 'entertainment'],
    notes: 'iPad Pro 12.9"',
    userId: 'user1',
  },
  {
    id: 'item3',
    name: 'Harry Potter Series',
    binId: 'D3E4F',
    quantity: 7,
    tags: ['books', 'fiction'],
    notes: 'Complete set',
    userId: 'user1',
  },
  {
    id: 'item4',
    name: 'Phillips Screwdriver',
    binId: 'J7K8L',
    quantity: 3,
    tags: ['tools', 'hardware'],
    notes: 'Various sizes',
    userId: 'user1',
  },
  {
    id: 'item5',
    name: 'Flathead Screwdriver',
    binId: 'J7K8L',
    quantity: 2,
    tags: ['tools', 'hardware'],
    notes: 'Small and medium',
    userId: 'user1',
  },
  {
    id: 'item6',
    name: 'Christmas Lights',
    binId: 'M9N0P',
    quantity: 4,
    tags: ['seasonal', 'decorations', 'christmas'],
    notes: 'LED string lights',
    userId: 'user1',
  },
];

// Mock tags
export const mockTags: Tag[] = [
  {
    id: 'tag1',
    name: 'electronics',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag2',
    name: 'books',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag3',
    name: 'tools',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag4',
    name: 'hardware',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag5',
    name: 'seasonal',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag6',
    name: 'decorations',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag7',
    name: 'valuable',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag8',
    name: 'media',
    userId: 'user1',
    type: 'BOTH',
  },
  {
    id: 'tag9',
    name: 'work',
    userId: 'user1',
    type: 'ITEM',
  },
  {
    id: 'tag10',
    name: 'entertainment',
    userId: 'user1',
    type: 'ITEM',
  },
  {
    id: 'tag11',
    name: 'fiction',
    userId: 'user1',
    type: 'ITEM',
  },
  {
    id: 'tag12',
    name: 'christmas',
    userId: 'user1',
    type: 'ITEM',
  },
];
