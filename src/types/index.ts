// Define the types for our data models

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Room = {
  id: string;
  name: string;
  userId: string;
  notes?: string;
};

export type Bin = {
  id: string; // 5-digit alphanumeric
  name: string;
  parentId: string; // either roomId or another binId
  parentType: 'ROOM' | 'BIN';
  tags: string[];
  notes?: string;
  userId: string;
};

export type Item = {
  id: string;
  name: string;
  binId: string;
  quantity: number;
  tags: string[];
  notes?: string;
  userId: string;
  imageUrls?: string[];
};

export type Tag = {
  id: string;
  name: string;
  userId: string;
  type: 'BIN' | 'ITEM' | 'BOTH';
};

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  RoomDetails: { roomId: string };
  BinDetails: { binId: string };
  ItemDetails: { itemId: string };
  Scanner: undefined;
  Search: undefined;
};

export type MainTabParamList = {
  Rooms: undefined;
  Bins: undefined;
  Items: undefined;
  Scanner: undefined;
  Search: undefined;
};
