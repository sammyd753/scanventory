import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../../types';
import Card from '../common/Card';
import { colors, typography, spacing } from '../../styles';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(room)}>
      <Card>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="home" size={24} color={colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{room.name}</Text>
            {room.notes && <Text style={styles.notes}>{room.notes}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.mediumGray} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notes: {
    fontSize: typography.fontSizeSmall,
    color: colors.darkGray,
  },
});

export default RoomCard;
