import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../types';
import { useAppSelector } from '../hooks/useRedux';
import { colors } from '../styles';

// Import screens (we'll create these next)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoomsScreen from '../screens/rooms/RoomsScreen';
import RoomDetailsScreen from '../screens/rooms/RoomDetailsScreen';
import BinsScreen from '../screens/bins/BinsScreen';
import BinDetailsScreen from '../screens/bins/BinDetailsScreen';
import ItemsScreen from '../screens/items/ItemsScreen';
import ItemDetailsScreen from '../screens/items/ItemDetailsScreen';
import ScannerScreen from '../screens/scanner/ScannerScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Rooms') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bins') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Items') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mediumGray,
        headerShown: true,
      })}
    >
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Bins" component={BinsScreen} />
      <Tab.Screen name="Items" component={ItemsScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
};

// Root navigator
const Navigation = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="RoomDetails" 
              component={RoomDetailsScreen} 
              options={{ headerShown: true, title: 'Room Details' }}
            />
            <Stack.Screen 
              name="BinDetails" 
              component={BinDetailsScreen} 
              options={{ headerShown: true, title: 'Bin Details' }}
            />
            <Stack.Screen 
              name="ItemDetails" 
              component={ItemDetailsScreen} 
              options={{ headerShown: true, title: 'Item Details' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
