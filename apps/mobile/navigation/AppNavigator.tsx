import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from '../src/screens/DashboardScreen';
import JobsListScreen from '../src/screens/JobsListScreen';
import JobDetailsScreen from '../src/screens/JobDetailsScreen';
import PhotoCaptureScreen from '../src/screens/PhotoCaptureScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0066CC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="JobsList" 
        component={JobsListScreen}
        options={{ title: 'My Jobs' }}
      />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen 
        name="PhotoCapture" 
        component={PhotoCaptureScreen}
        options={{ 
          title: 'Take Photo',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0066CC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="DashboardMain" 
        component={DashboardScreen}
        options={{ title: 'Field Dashboard' }}
      />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen 
        name="PhotoCapture" 
        component={PhotoCaptureScreen}
        options={{ 
          title: 'Take Photo',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Placeholder screen for Messages and Profile
function PlaceholderScreen() {
  return (
    <DashboardScreen navigation={undefined} />
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'message' : 'message-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsStack}
        options={{ title: 'Jobs' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Messages',
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PlaceholderScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
