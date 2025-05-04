import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, Item } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchItems } from '../../store/slices/itemSlice';
import { colors, spacing, globalStyles, typography } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Items'>,
  NativeStackScreenProps<RootStackParamList>
>;

const ItemsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.items);
  const { bins } = useAppSelector(state => state.bins);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    dispatch(fetchItems());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchItems()).finally(() => setRefreshing(false));
  };

  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  };

  const getBinName = (binId: string) => {
    const bin = bins.find(bin => bin.id === binId);
    return bin ? bin.name : 'Unknown Bin';
  };

  const renderItemItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Card>
        <View style={styles.itemContainer}>
          <View style={styles.itemIconContainer}>
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.itemContentContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemBin}>Bin: {getBinName(item.binId)}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            {item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {item.tags.length > 2 && (
                  <Text style={styles.moreTagsText}>+{item.tags.length - 2} more</Text>
                )}
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && !refreshing && items.length === 0) {
    return <Loading message="Loading items..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItemItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          error ? <ErrorMessage message={error} onRetry={loadItems} /> : null
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => {}}>
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  listContent: {
    padding: spacing.m,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  itemContentContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  },
  itemBin: {
    fontSize: typography.fontSizeSmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  itemQuantity: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.secondary + '30', // 30% opacity
    borderRadius: 12,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs / 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: typography.fontSizeSmall,
    color: colors.text,
  },
  moreTagsText: {
    fontSize: typography.fontSizeSmall,
    color: colors.mediumGray,
    marginLeft: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.l,
    right: spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ItemsScreen;
