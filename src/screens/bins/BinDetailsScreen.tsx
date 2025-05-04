import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Item, Bin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBin, fetchBinsByParent } from '../../store/slices/binSlice';
import { fetchItemsByBin } from '../../store/slices/itemSlice';
import { colors, typography, spacing, globalStyles } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'BinDetails'>;

const BinDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { binId } = route.params;
  const dispatch = useAppDispatch();
  const { currentBin, bins, loading: binLoading, error: binError } = useAppSelector(state => state.bins);
  const { items, loading: itemsLoading, error: itemsError } = useAppSelector(state => state.items);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'bins'>('items');

  useEffect(() => {
    loadBinData();
  }, [binId]);

  const loadBinData = () => {
    dispatch(fetchBin(binId));
    dispatch(fetchItemsByBin(binId));
    dispatch(fetchBinsByParent({ parentId: binId, parentType: 'BIN' }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchBin(binId)),
      dispatch(fetchItemsByBin(binId)),
      dispatch(fetchBinsByParent({ parentId: binId, parentType: 'BIN' }))
    ]).finally(() => setRefreshing(false));
  };

  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  };

  const handleBinPress = (bin: Bin) => {
    navigation.navigate('BinDetails', { binId: bin.id });
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
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
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
        <View style={styles.binContainer}>
          <View style={styles.binIconContainer}>
            <Ionicons name="cube" size={24} color={colors.primary} />
          </View>
          <View style={styles.binContentContainer}>
            <Text style={styles.binName}>{item.name}</Text>
            <Text style={styles.binId}>ID: {item.id}</Text>
            {item.notes && <Text style={styles.binNotes}>{item.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if ((binLoading || itemsLoading) && !refreshing && !currentBin) {
    return <Loading message="Loading bin details..." />;
  }

  if (!currentBin) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage 
          message={binError || "Bin not found"} 
          onRetry={loadBinData} 
        />
      </SafeAreaView>
    );
  }

  const binItems = items.filter(item => item.binId === binId);
  const subBins = bins.filter(bin => bin.parentId === binId && bin.parentType === 'BIN');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.binName}>{currentBin.name}</Text>
        <Text style={styles.binId}>ID: {currentBin.id}</Text>
        {currentBin.notes && (
          <Text style={styles.binNotes}>{currentBin.notes}</Text>
        )}
        {currentBin.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {currentBin.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'items' && styles.activeTab]} 
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            Items ({binItems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bins' && styles.activeTab]} 
          onPress={() => setActiveTab('bins')}
        >
          <Text style={[styles.tabText, activeTab === 'bins' && styles.activeTabText]}>
            Bins ({subBins.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'items' ? (
        <FlatList
          data={binItems}
          keyExtractor={item => item.id}
          renderItem={renderItemItem}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            itemsError ? <ErrorMessage message={itemsError} onRetry={loadBinData} /> : null
          }
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>No items in this bin yet</Text>
            </Card>
          }
        />
      ) : (
        <FlatList
          data={subBins}
          keyExtractor={item => item.id}
          renderItem={renderBinItem}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            binError ? <ErrorMessage message={binError} onRetry={loadBinData} /> : null
          }
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>No bins inside this bin yet</Text>
            </Card>
          }
        />
      )}

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
  header: {
    padding: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  binName: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  binId: {
    fontSize: typography.fontSizeRegular,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  binNotes: {
    fontSize: typography.fontSizeRegular,
    color: colors.darkGray,
    marginBottom: spacing.s,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizeMedium,
    color: colors.mediumGray,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
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
  itemQuantity: {
    fontSize: typography.fontSizeSmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  itemNotes: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  binContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  binIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  binContentContainer: {
    flex: 1,
  },
  binNotes: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  emptyText: {
    fontSize: typography.fontSizeRegular,
    color: colors.mediumGray,
    textAlign: 'center',
    padding: spacing.m,
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

export default BinDetailsScreen;
