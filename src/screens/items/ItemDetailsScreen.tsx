import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchItem } from '../../store/slices/itemSlice';
import { colors, typography, spacing, globalStyles } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

const ItemDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const dispatch = useAppDispatch();
  const { currentItem, loading, error } = useAppSelector(state => state.items);
  const { bins } = useAppSelector(state => state.bins);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItemData();
  }, [itemId]);

  const loadItemData = () => {
    dispatch(fetchItem(itemId));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchItem(itemId)).finally(() => setRefreshing(false));
  };

  const getBinName = (binId: string) => {
    const bin = bins.find(bin => bin.id === binId);
    return bin ? bin.name : 'Unknown Bin';
  };

  if (loading && !refreshing && !currentItem) {
    return <Loading message="Loading item details..." />;
  }

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage 
          message={error || "Item not found"} 
          onRetry={loadItemData} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Card>
          <View style={styles.header}>
            <Text style={styles.itemName}>{currentItem.name}</Text>
            <Text style={styles.itemQuantity}>Quantity: {currentItem.quantity}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity 
              style={styles.binContainer}
              onPress={() => navigation.navigate('BinDetails', { binId: currentItem.binId })}
            >
              <Ionicons name="cube" size={20} color={colors.primary} />
              <Text style={styles.binName}>{getBinName(currentItem.binId)}</Text>
              <Text style={styles.binId}>({currentItem.binId})</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mediumGray} />
            </TouchableOpacity>
          </View>

          {currentItem.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {currentItem.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {currentItem.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notes}>{currentItem.notes}</Text>
            </View>
          )}
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <Ionicons name="create-outline" size={24} color={colors.white} />
          <Text style={styles.editButtonText}>Edit Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.m,
  },
  header: {
    marginBottom: spacing.m,
  },
  itemName: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    fontSize: typography.fontSizeMedium,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    marginBottom: spacing.s,
  },
  binContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10', // 10% opacity
    padding: spacing.s,
    borderRadius: 8,
  },
  binName: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    marginLeft: spacing.s,
    flex: 1,
  },
  binId: {
    fontSize: typography.fontSizeSmall,
    color: colors.mediumGray,
    marginRight: spacing.s,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  notes: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    marginLeft: spacing.s,
  },
});

export default ItemDetailsScreen;
