import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, Bin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBins } from '../../store/slices/binSlice';
import { colors, spacing, globalStyles, typography } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Bins'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BinsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { bins, loading, error } = useAppSelector(state => state.bins);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBins();
  }, []);

  const loadBins = () => {
    dispatch(fetchBins());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchBins()).finally(() => setRefreshing(false));
  };

  const handleBinPress = (bin: Bin) => {
    navigation.navigate('BinDetails', { binId: bin.id });
  };

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
            {item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {item.tags.length > 3 && (
                  <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
                )}
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && !refreshing && bins.length === 0) {
    return <Loading message="Loading bins..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bins}
        keyExtractor={item => item.id}
        renderItem={renderBinItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          error ? <ErrorMessage message={error} onRetry={loadBins} /> : null
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
  binName: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  },
  binId: {
    fontSize: typography.fontSizeSmall,
    color: colors.primary,
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

export default BinsScreen;
