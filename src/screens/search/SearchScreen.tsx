import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, Room, Bin, Item } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchItems, setQuery } from '../../store/slices/searchSlice';
import { colors, typography, spacing, globalStyles } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

type SearchResultType = 'room' | 'bin' | 'item';

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { query, results, loading, error } = useAppSelector(state => state.search);
  const [activeTab, setActiveTab] = useState<SearchResultType>('all');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (text: string) => {
    dispatch(setQuery(text));
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay the search
    if (text.length > 0) {
      const timeout = setTimeout(() => {
        dispatch(searchItems(text));
      }, 500); // 500ms delay
      
      setSearchTimeout(timeout);
    }
  };

  const handleClearSearch = () => {
    dispatch(setQuery(''));
  };

  const handleRoomPress = (room: Room) => {
    navigation.navigate('RoomDetails', { roomId: room.id });
  };

  const handleBinPress = (bin: Bin) => {
    navigation.navigate('BinDetails', { binId: bin.id });
  };

  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <TouchableOpacity onPress={() => handleRoomPress(item)}>
      <Card>
        <View style={styles.itemContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="home" size={24} color={colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderBinItem = ({ item }: { item: Bin }) => (
    <TouchableOpacity onPress={() => handleBinPress(item)}>
      <Card>
        <View style={styles.itemContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="cube" size={24} color={colors.secondary} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemId}>ID: {item.id}</Text>
            {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderItemItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Card>
        <View style={styles.itemContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="cube-outline" size={24} color={colors.warning} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const getFilteredResults = () => {
    if (activeTab === 'room') return results.rooms;
    if (activeTab === 'bin') return results.bins;
    if (activeTab === 'item') return results.items;
    
    // For 'all', we combine all results with a type indicator
    return [
      ...results.rooms.map(room => ({ ...room, type: 'room' as const })),
      ...results.bins.map(bin => ({ ...bin, type: 'bin' as const })),
      ...results.items.map(item => ({ ...item, type: 'item' as const })),
    ];
  };

  const renderItem = ({ item }: { item: (Room | Bin | Item) & { type?: 'room' | 'bin' | 'item' } }) => {
    if (activeTab === 'all') {
      if (item.type === 'room') return renderRoomItem({ item: item as Room });
      if (item.type === 'bin') return renderBinItem({ item: item as Bin });
      if (item.type === 'item') return renderItemItem({ item: item as Item });
      return null;
    }
    
    if (activeTab === 'room') return renderRoomItem({ item: item as Room });
    if (activeTab === 'bin') return renderBinItem({ item: item as Bin });
    if (activeTab === 'item') return renderItemItem({ item: item as Item });
    
    return null;
  };

  const getTotalCount = () => {
    return results.rooms.length + results.bins.length + results.items.length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.mediumGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search rooms, bins, or items..."
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => query && dispatch(searchItems(query))}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({getTotalCount()})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'room' && styles.activeTab]} 
          onPress={() => setActiveTab('room')}
        >
          <Text style={[styles.tabText, activeTab === 'room' && styles.activeTabText]}>
            Rooms ({results.rooms.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bin' && styles.activeTab]} 
          onPress={() => setActiveTab('bin')}
        >
          <Text style={[styles.tabText, activeTab === 'bin' && styles.activeTabText]}>
            Bins ({results.bins.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'item' && styles.activeTab]} 
          onPress={() => setActiveTab('item')}
        >
          <Text style={[styles.tabText, activeTab === 'item' && styles.activeTabText]}>
            Items ({results.items.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading message="Searching..." />
      ) : (
        <FlatList
          data={getFilteredResults()}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            error ? <ErrorMessage message={error} /> : null
          }
          ListEmptyComponent={
            query.length > 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color={colors.mediumGray} />
                <Text style={styles.emptyText}>No results found for "{query}"</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color={colors.mediumGray} />
                <Text style={styles.emptyText}>Search for rooms, bins, or items</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  searchContainer: {
    padding: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: typography.fontSizeRegular,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizeSmall,
    color: colors.mediumGray,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
  listContent: {
    padding: spacing.m,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  contentContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  },
  itemId: {
    fontSize: typography.fontSizeSmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  itemQuantity: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  itemNotes: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizeRegular,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: spacing.m,
  },
});

export default SearchScreen;
