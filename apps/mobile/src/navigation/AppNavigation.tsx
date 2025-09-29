import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, Badge } from 'react-native-paper';
import { View } from 'react-native';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import EnquiryManagementScreen from '../screens/EnquiryManagementScreen';
import FieldManagementScreen from '../screens/FieldManagementScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function EnquiryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="EnquiryManagement" 
        component={EnquiryManagementScreen as any} 
      />
    </Stack.Navigator>
  );
}

function FieldStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="FieldManagement" 
        component={FieldManagementScreen as any} 
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen as any} 
      />
    </Stack.Navigator>
  );
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

interface TabBarBadgeProps {
  count?: number;
  show?: boolean;
}

function TabBarBadge({ count, show }: TabBarBadgeProps) {
  if (!show || !count || count === 0) return null;
  
  return (
    <Badge
      size={16}
      style={{
        position: 'absolute',
        top: -3,
        right: -6,
        backgroundColor: '#F44336',
      }}
    >
      {count > 99 ? '99+' : count.toString()}
    </Badge>
  );
}

export default function AppNavigation() {
  const theme = useTheme();
  
  // Mock data for badges - in real app, get from state/API
  const pendingEnquiries = 5;
  const activeTasks = 3;
  const hasNotifications = true;

  return (
    <NavigationContainer
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#2196F3',
          background: theme.dark ? '#121212' : '#ffffff',
          card: theme.dark ? '#1E1E1E' : '#ffffff',
          text: theme.dark ? '#ffffff' : '#000000',
          border: theme.dark ? '#333333' : '#e0e0e0',
          notification: '#F44336',
        }
      }}
    >
      <Tab.Navigator
        initialRouteName="DashboardTab"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            backgroundColor: theme.dark ? '#1E1E1E' : '#ffffff',
            borderTopColor: theme.dark ? '#333333' : '#e0e0e0',
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="DashboardTab"
          component={DashboardStack}
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
              <MaterialIcons 
                name="dashboard" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        <Tab.Screen
          name="EnquiryTab"
          component={EnquiryStack}
          options={{
            title: 'Enquiries',
            tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
              <View style={{ position: 'relative' }}>
                <MaterialIcons 
                  name="assignment" 
                  size={size} 
                  color={color} 
                />
                <TabBarBadge count={pendingEnquiries} show={pendingEnquiries > 0} />
              </View>
            ),
            ...(pendingEnquiries > 0 && { tabBarBadge: pendingEnquiries }),
          }}
        />
        
        <Tab.Screen
          name="FieldTab"
          component={FieldStack}
          options={{
            title: 'Field Work',
            tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
              <View style={{ position: 'relative' }}>
                <MaterialIcons 
                  name="location-on" 
                  size={size} 
                  color={color} 
                />
                <TabBarBadge count={activeTasks} show={activeTasks > 0} />
              </View>
            ),
            ...(activeTasks > 0 && { tabBarBadge: activeTasks }),
          }}
        />
        
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
              <View style={{ position: 'relative' }}>
                <MaterialIcons 
                  name="settings" 
                  size={size} 
                  color={color} 
                />
                <TabBarBadge count={1} show={hasNotifications} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}