import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  IconButton,
  Chip,
  Switch,
  Portal,
  Modal,
  TextInput,
  List,
  Divider,
  Badge,
  Avatar,
  ProgressBar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

interface NotificationSettings {
  enabled: boolean;
  newEnquiries: boolean;
  taskReminders: boolean;
  appointmentAlerts: boolean;
  projectUpdates: boolean;
  systemMessages: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  offline: {
    autoSync: boolean;
    syncInterval: number; // minutes
    maxStorageSize: number; // MB
  };
  location: {
    trackingEnabled: boolean;
    highAccuracy: boolean;
    backgroundTracking: boolean;
  };
  camera: {
    quality: 'low' | 'medium' | 'high';
    autoUpload: boolean;
    geotagging: boolean;
  };
  security: {
    biometricAuth: boolean;
    autoLock: number; // minutes
    dataEncryption: boolean;
  };
}

interface SystemInfo {
  appVersion: string;
  buildNumber: string;
  deviceModel: string;
  osVersion: string;
  platform: string;
  installationId: string;
  pushToken?: string;
  storageUsed: number; // MB
  storageAvailable: number; // MB
  lastSync: string | null;
  networkType: string;
  batteryLevel?: number;
}

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    newEnquiries: true,
    taskReminders: true,
    appointmentAlerts: true,
    projectUpdates: false,
    systemMessages: true,
    sound: true,
    vibration: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en-GB',
    offline: {
      autoSync: true,
      syncInterval: 30,
      maxStorageSize: 500
    },
    location: {
      trackingEnabled: true,
      highAccuracy: true,
      backgroundTracking: false
    },
    camera: {
      quality: 'high',
      autoUpload: true,
      geotagging: true
    },
    security: {
      biometricAuth: false,
      autoLock: 15,
      dataEncryption: true
    }
  });

  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    appVersion: '1.0.0',
    buildNumber: '100',
    deviceModel: 'Unknown',
    osVersion: 'Unknown',
    platform: Platform.OS,
    installationId: 'install-' + Date.now(),
    storageUsed: 125.6,
    storageAvailable: 2048.3,
    lastSync: null,
    networkType: 'Unknown'
  });

  useEffect(() => {
    initializeSettings();
    checkNetworkStatus();
    getDeviceInfo();
    loadStoredSettings();

    // Network listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      setSystemInfo(prev => ({
        ...prev,
        networkType: state.type || 'Unknown'
      }));
    });

    return () => unsubscribe();
  }, []);

  const initializeSettings = async () => {
    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: notificationSettings.sound,
        shouldSetBadge: false,
      }),
    });

    // Register for push notifications if enabled
    if (notificationSettings.enabled) {
      await registerForPushNotifications();
    }
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert('Push Notifications', 'Must use physical device for push notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Failed to get push token for push notification!');
      return;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      setSystemInfo(prev => ({
        ...prev,
        pushToken: token.data
      }));

      // Send token to backend
      // await sendPushTokenToServer(token.data);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  const checkNetworkStatus = async () => {
    const netInfo = await NetInfo.fetch();
    setIsOnline(netInfo.isConnected ?? false);
    setSystemInfo(prev => ({
      ...prev,
      networkType: netInfo.type || 'Unknown'
    }));
  };

  const getDeviceInfo = async () => {
    try {
      const deviceModel = Device.modelName || 'Unknown';
      const osVersion = Device.osVersion || 'Unknown';
      
      setSystemInfo(prev => ({
        ...prev,
        deviceModel,
        osVersion
      }));
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  };

  const loadStoredSettings = async () => {
    try {
      const storedNotifications = await SecureStore.getItemAsync('notifications');
      const storedAppSettings = await SecureStore.getItemAsync('appSettings');
      
      if (storedNotifications) {
        setNotificationSettings(JSON.parse(storedNotifications));
      }
      
      if (storedAppSettings) {
        setAppSettings(JSON.parse(storedAppSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await SecureStore.setItemAsync('notifications', JSON.stringify(notificationSettings));
      await SecureStore.setItemAsync('appSettings', JSON.stringify(appSettings));
      
      Alert.alert('Settings Saved', 'Your preferences have been saved successfully.');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      await checkNetworkStatus();
      await getDeviceInfo();
      
      // Simulate sync status update
      setSystemInfo(prev => ({
        ...prev,
        lastSync: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from CRM Nexus',
          sound: notificationSettings.sound,
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached data and offline content. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored data
              await SecureStore.deleteItemAsync('offlineData');
              await SecureStore.deleteItemAsync('cachedImages');
              
              setSystemInfo(prev => ({
                ...prev,
                storageUsed: 45.2
              }));
              
              Alert.alert('Success', 'Cache cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache.');
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    Alert.alert(
      'Export Data',
      'This will create a backup of your local data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // Implement data export
            Alert.alert('Export Started', 'Your data export will be available shortly.');
          }
        }
      ]
    );
  };

  const resetApp = async () => {
    Alert.alert(
      'Reset Application',
      'This will reset all settings and clear all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all stored data
              await SecureStore.deleteItemAsync('notifications');
              await SecureStore.deleteItemAsync('appSettings');
              await SecureStore.deleteItemAsync('offlineData');
              await SecureStore.deleteItemAsync('userCredentials');
              
              Alert.alert('Reset Complete', 'Application has been reset. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset application.');
            }
          }
        }
      ]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-GB');
  };

  const getStorageUsagePercentage = () => {
    const total = systemInfo.storageUsed + systemInfo.storageAvailable;
    return (systemInfo.storageUsed / total) * 100;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Settings</Title>
          <Text style={styles.headerSubtitle}>Customize your CRM experience</Text>
        </View>
        <View style={styles.headerActions}>
          {!isOnline && (
            <MaterialIcons name="cloud-off" size={24} color="white" />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="notifications" size={24} color="#2196F3" />
                <Title style={styles.sectionTitle}>Notifications</Title>
              </View>
              <Button
                mode="outlined"
                onPress={() => setShowNotificationModal(true)}
                compact
              >
                Configure
              </Button>
            </View>

            <List.Item
              title="Push Notifications"
              description={notificationSettings.enabled ? "Enabled" : "Disabled"}
              left={() => <List.Icon icon="bell" />}
              right={() => (
                <Switch
                  value={notificationSettings.enabled}
                  onValueChange={(value) => {
                    setNotificationSettings(prev => ({ ...prev, enabled: value }));
                    if (value) {
                      registerForPushNotifications();
                    }
                  }}
                />
              )}
            />

            <List.Item
              title="Test Notification"
              description="Send a test notification"
              left={() => <List.Icon icon="bell-ring" />}
              onPress={testNotification}
              disabled={!notificationSettings.enabled}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="settings" size={24} color="#4CAF50" />
                <Title style={styles.sectionTitle}>Application</Title>
              </View>
            </View>

            <List.Item
              title="Theme"
              description={appSettings.theme.charAt(0).toUpperCase() + appSettings.theme.slice(1)}
              left={() => <List.Icon icon="palette" />}
              onPress={() => {
                const themes = ['light', 'dark', 'auto'];
                const currentIndex = themes.indexOf(appSettings.theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                setAppSettings(prev => ({ ...prev, theme: nextTheme as any }));
              }}
            />

            <List.Item
              title="Language"
              description="English (UK)"
              left={() => <List.Icon icon="translate" />}
              onPress={() => Alert.alert('Language', 'Language selection coming soon')}
            />

            <List.Item
              title="Offline Sync"
              description={appSettings.offline.autoSync ? "Auto sync enabled" : "Manual sync only"}
              left={() => <List.Icon icon="sync" />}
              right={() => (
                <Switch
                  value={appSettings.offline.autoSync}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ 
                      ...prev, 
                      offline: { ...prev.offline, autoSync: value }
                    }))
                  }
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Location Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="location-on" size={24} color="#FF9800" />
                <Title style={styles.sectionTitle}>Location</Title>
              </View>
            </View>

            <List.Item
              title="Location Tracking"
              description={appSettings.location.trackingEnabled ? "Enabled" : "Disabled"}
              left={() => <List.Icon icon="crosshairs-gps" />}
              right={() => (
                <Switch
                  value={appSettings.location.trackingEnabled}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, trackingEnabled: value }
                    }))
                  }
                />
              )}
            />

            <List.Item
              title="High Accuracy GPS"
              description={appSettings.location.highAccuracy ? "High precision" : "Battery saver"}
              left={() => <List.Icon icon="target" />}
              right={() => (
                <Switch
                  value={appSettings.location.highAccuracy}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, highAccuracy: value }
                    }))
                  }
                  disabled={!appSettings.location.trackingEnabled}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="security" size={24} color="#F44336" />
                <Title style={styles.sectionTitle}>Security</Title>
              </View>
            </View>

            <List.Item
              title="Biometric Authentication"
              description={appSettings.security.biometricAuth ? "Enabled" : "Disabled"}
              left={() => <List.Icon icon="fingerprint" />}
              right={() => (
                <Switch
                  value={appSettings.security.biometricAuth}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ 
                      ...prev, 
                      security: { ...prev.security, biometricAuth: value }
                    }))
                  }
                />
              )}
            />

            <List.Item
              title="Data Encryption"
              description={appSettings.security.dataEncryption ? "Enabled" : "Disabled"}
              left={() => <List.Icon icon="lock" />}
              right={() => (
                <Switch
                  value={appSettings.security.dataEncryption}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ 
                      ...prev, 
                      security: { ...prev.security, dataEncryption: value }
                    }))
                  }
                />
              )}
            />

            <List.Item
              title="Auto Lock"
              description={`${appSettings.security.autoLock} minutes`}
              left={() => <List.Icon icon="timer-lock" />}
              onPress={() => {
                const times = [5, 10, 15, 30, 60];
                const currentIndex = times.indexOf(appSettings.security.autoLock);
                const nextTime = times[(currentIndex + 1) % times.length];
                setAppSettings(prev => ({ 
                  ...prev, 
                  security: { ...prev.security, autoLock: nextTime }
                }));
              }}
            />
          </Card.Content>
        </Card>

        {/* Storage & Data */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="storage" size={24} color="#9C27B0" />
                <Title style={styles.sectionTitle}>Storage & Data</Title>
              </View>
              <Button
                mode="outlined"
                onPress={() => setShowDataModal(true)}
                compact
              >
                Details
              </Button>
            </View>

            <View style={styles.storageInfo}>
              <Text style={styles.storageText}>
                Used: {formatBytes(systemInfo.storageUsed * 1024 * 1024)} / 
                Available: {formatBytes(systemInfo.storageAvailable * 1024 * 1024)}
              </Text>
              <ProgressBar 
                progress={getStorageUsagePercentage() / 100} 
                color="#9C27B0"
                style={styles.storageBar}
              />
            </View>

            <List.Item
              title="Clear Cache"
              description="Remove temporary files and cached data"
              left={() => <List.Icon icon="delete-sweep" />}
              onPress={clearCache}
            />

            <List.Item
              title="Export Data"
              description="Create a backup of your data"
              left={() => <List.Icon icon="export" />}
              onPress={exportData}
            />
          </Card.Content>
        </Card>

        {/* System Information */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="info" size={24} color="#607D8B" />
                <Title style={styles.sectionTitle}>System Information</Title>
              </View>
              <Button
                mode="outlined"
                onPress={() => setShowAboutModal(true)}
                compact
              >
                About
              </Button>
            </View>

            <List.Item
              title="App Version"
              description={`${systemInfo.appVersion} (${systemInfo.buildNumber})`}
              left={() => <List.Icon icon="information" />}
            />

            <List.Item
              title="Device"
              description={`${systemInfo.deviceModel} - ${systemInfo.platform} ${systemInfo.osVersion}`}
              left={() => <List.Icon icon="cellphone" />}
            />

            <List.Item
              title="Network"
              description={`${systemInfo.networkType} - ${isOnline ? 'Connected' : 'Offline'}`}
              left={() => <List.Icon icon="wifi" />}
              right={() => (
                <MaterialIcons 
                  name={isOnline ? "wifi" : "wifi-off"} 
                  size={24} 
                  color={isOnline ? "#4CAF50" : "#F44336"} 
                />
              )}
            />

            <List.Item
              title="Last Sync"
              description={formatDate(systemInfo.lastSync)}
              left={() => <List.Icon icon="sync" />}
            />
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={[styles.settingsCard, styles.lastCard]}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={saveSettings}
              style={styles.saveButton}
              icon="content-save"
            >
              Save Settings
            </Button>

            <Button
              mode="outlined"
              onPress={resetApp}
              style={styles.resetButton}
              textColor="#F44336"
              icon="restore"
            >
              Reset Application
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* About Modal */}
      <Portal>
        <Modal
          visible={showAboutModal}
          onDismiss={() => setShowAboutModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.aboutHeader}>
            <Avatar.Image 
              size={64} 
              source={{ uri: 'https://via.placeholder.com/64x64.png?text=CRM' }}
              style={styles.appIcon}
            />
            <Title style={styles.appName}>CRM Nexus Mobile</Title>
            <Text style={styles.appVersion}>Version {systemInfo.appVersion}</Text>
          </View>

          <Paragraph style={styles.aboutDescription}>
            CRM Nexus Mobile is a comprehensive customer relationship management solution 
            designed for the bathroom and kitchen industry. Built with React Native and 
            Expo for seamless cross-platform experience.
          </Paragraph>

          <Divider style={styles.aboutDivider} />

          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Developer:</Text>
            <Text style={styles.aboutValue}>Bowman Bathrooms Ltd</Text>
            
            <Text style={styles.aboutLabel}>Build:</Text>
            <Text style={styles.aboutValue}>{systemInfo.buildNumber}</Text>
            
            <Text style={styles.aboutLabel}>Installation ID:</Text>
            <Text style={styles.aboutValue}>{systemInfo.installationId}</Text>
            
            {systemInfo.pushToken && (
              <>
                <Text style={styles.aboutLabel}>Push Token:</Text>
                <Text style={[styles.aboutValue, styles.tokenText]} numberOfLines={2}>
                  {systemInfo.pushToken}
                </Text>
              </>
            )}
          </View>

          <Button
            mode="contained"
            onPress={() => setShowAboutModal(false)}
            style={styles.modalButton}
          >
            Close
          </Button>
        </Modal>
      </Portal>

      {/* Notification Settings Modal */}
      <Portal>
        <Modal
          visible={showNotificationModal}
          onDismiss={() => setShowNotificationModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Notification Settings</Title>
          
          <View style={styles.notificationSettings}>
            <List.Item
              title="New Enquiries"
              right={() => (
                <Switch
                  value={notificationSettings.newEnquiries}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, newEnquiries: value }))
                  }
                />
              )}
            />
            
            <List.Item
              title="Task Reminders"
              right={() => (
                <Switch
                  value={notificationSettings.taskReminders}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, taskReminders: value }))
                  }
                />
              )}
            />
            
            <List.Item
              title="Appointment Alerts"
              right={() => (
                <Switch
                  value={notificationSettings.appointmentAlerts}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, appointmentAlerts: value }))
                  }
                />
              )}
            />
            
            <List.Item
              title="Project Updates"
              right={() => (
                <Switch
                  value={notificationSettings.projectUpdates}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, projectUpdates: value }))
                  }
                />
              )}
            />
            
            <Divider style={styles.settingsDivider} />
            
            <List.Item
              title="Sound"
              right={() => (
                <Switch
                  value={notificationSettings.sound}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, sound: value }))
                  }
                />
              )}
            />
            
            <List.Item
              title="Vibration"
              right={() => (
                <Switch
                  value={notificationSettings.vibration}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, vibration: value }))
                  }
                />
              )}
            />
          </View>

          <Button
            mode="contained"
            onPress={() => setShowNotificationModal(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>
      </Portal>

      {/* Data Management Modal */}
      <Portal>
        <Modal
          visible={showDataModal}
          onDismiss={() => setShowDataModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Storage & Data Management</Title>
          
          <View style={styles.dataBreakdown}>
            <Text style={styles.dataLabel}>Storage Breakdown:</Text>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataItemLabel}>Photos & Media</Text>
              <Text style={styles.dataItemValue}>85.3 MB</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataItemLabel}>Offline Data</Text>
              <Text style={styles.dataItemValue}>32.1 MB</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataItemLabel}>Cache</Text>
              <Text style={styles.dataItemValue}>8.2 MB</Text>
            </View>
            
            <Divider style={styles.settingsDivider} />
            
            <View style={styles.dataItem}>
              <Text style={[styles.dataItemLabel, styles.totalLabel]}>Total Used</Text>
              <Text style={[styles.dataItemValue, styles.totalValue]}>125.6 MB</Text>
            </View>
          </View>

          <View style={styles.dataActions}>
            <Button
              mode="outlined"
              onPress={clearCache}
              style={styles.dataActionButton}
              icon="delete-sweep"
            >
              Clear Cache
            </Button>
            
            <Button
              mode="outlined"
              onPress={exportData}
              style={styles.dataActionButton}
              icon="export"
            >
              Export Data
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={() => setShowDataModal(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  settingsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  lastCard: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 18,
  },
  storageInfo: {
    marginBottom: 16,
  },
  storageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
  },
  saveButton: {
    marginBottom: 12,
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    borderColor: '#F44336',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
  },
  aboutDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutDivider: {
    marginVertical: 16,
  },
  aboutInfo: {
    marginBottom: 20,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  aboutValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  notificationSettings: {
    marginBottom: 20,
  },
  settingsDivider: {
    marginVertical: 8,
  },
  dataBreakdown: {
    marginBottom: 20,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dataItemLabel: {
    fontSize: 14,
    color: '#333',
  },
  dataItemValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontWeight: '600',
    color: '#000',
  },
  dataActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dataActionButton: {
    flex: 1,
  },
});