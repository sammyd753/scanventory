import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, Room } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchRooms } from '../../store/slices/roomSlice';
import { colors, spacing, globalStyles } from '../../styles';
import RoomCard from '../../components/rooms/RoomCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Rooms'>,
  NativeStackScreenProps<RootStackParamList>
>;

const RoomsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { rooms, loading, error } = useAppSelector(state => state.rooms);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    dispatch(fetchRooms());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchRooms()).finally(() => setRefreshing(false));
  };

  const handleRoomPress = (room: Room) => {
    navigation.navigate('RoomDetails', { roomId: room.id });
  };

  if (loading && !refreshing && rooms.length === 0) {
    return <Loading message="Loading rooms..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RoomCard room={item} onPress={handleRoomPress} />}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          error ? <ErrorMessage message={error} onRetry={loadRooms} /> : null
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

export default RoomsScreen;
