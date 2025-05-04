import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Bin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchRoom } from '../../store/slices/roomSlice';
import { fetchBinsByParent } from '../../store/slices/binSlice';
import { colors, typography, spacing, globalStyles } from '../../styles';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomDetails'>;

const RoomDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId } = route.params;
  const dispatch = useAppDispatch();
  const { currentRoom, loading: roomLoading, error: roomError } = useAppSelector(state => state.rooms);
  const { bins, loading: binsLoading, error: binsError } = useAppSelector(state => state.bins);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRoomData();
  }, [roomId]);

  const loadRoomData = () => {
    dispatch(fetchRoom(roomId));
    dispatch(fetchBinsByParent({ parentId: roomId, parentType: 'ROOM' }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchRoom(roomId)),
      dispatch(fetchBinsByParent({ parentId: roomId, parentType: 'ROOM' }))
    ]).finally(() => setRefreshing(false));
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
            {item.notes && <Text style={styles.binNotes}>{item.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if ((roomLoading || binsLoading) && !refreshing && !currentRoom) {
    return <Loading message="Loading room details..." />;
  }

  if (!currentRoom) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage 
          message={roomError || "Room not found"} 
          onRetry={loadRoomData} 
        />
      </SafeAreaView>
    );
  }

  const roomBins = bins.filter(bin => bin.parentId === roomId && bin.parentType === 'ROOM');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomName}>{currentRoom.name}</Text>
        {currentRoom.notes && (
          <Text style={styles.roomNotes}>{currentRoom.notes}</Text>
        )}
      </View>

      <View style={styles.binsHeader}>
        <Text style={styles.binsTitle}>Bins in this room</Text>
        <Text style={styles.binsCount}>{roomBins.length} bins</Text>
      </View>

      <FlatList
        data={roomBins}
        keyExtractor={item => item.id}
        renderItem={renderBinItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          binsError ? <ErrorMessage message={binsError} onRetry={loadRoomData} /> : null
        }
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>No bins in this room yet</Text>
          </Card>
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
  header: {
    padding: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  roomName: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roomNotes: {
    fontSize: typography.fontSizeRegular,
    color: colors.darkGray,
  },
  binsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  binsTitle: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  },
  binsCount: {
    fontSize: typography.fontSizeRegular,
    color: colors.mediumGray,
  },
  listContent: {
    padding: spacing.m,
    paddingTop: 0,
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

export default RoomDetailsScreen;
