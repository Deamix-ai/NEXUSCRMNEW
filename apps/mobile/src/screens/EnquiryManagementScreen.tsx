import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  IconButton,
  Chip,
  Searchbar,
  FAB,
  Portal,
  Modal,
  TextInput,
  Divider,
  ActivityIndicator,
  Badge,
  Avatar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

interface Enquiry {
  id: string;
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountId: string;
  ownerId: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedValue: number;
  source: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  tags: string[];
  isOffline?: boolean;
  syncStatus?: 'pending' | 'synced' | 'error';
}

interface EnquiryScreenProps {
  navigation: any;
}

const mockEnquiries: Enquiry[] = [
  {
    id: '1',
    title: 'Kitchen Renovation Enquiry',
    description: 'Customer interested in complete kitchen renovation with modern appliances',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '07123456789',
    accountId: 'acc-1',
    ownerId: 'user-1',
    status: 'NEW',
    priority: 'HIGH',
    estimatedValue: 25000,
    source: 'Website',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      address: '123 Kitchen Lane, London, SW1A 1AA'
    },
    createdAt: '2025-09-19T09:00:00Z',
    updatedAt: '2025-09-19T09:00:00Z',
    nextFollowUpDate: '2025-09-20T10:00:00Z',
    tags: ['kitchen', 'renovation', 'high-value'],
    syncStatus: 'synced'
  },
  {
    id: '2',
    title: 'Bathroom Upgrade',
    description: 'Small bathroom modernization with new fixtures',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '07987654321',
    accountId: 'acc-2',
    ownerId: 'user-2',
    status: 'CONTACTED',
    priority: 'MEDIUM',
    estimatedValue: 8500,
    source: 'Referral',
    location: {
      latitude: 51.4816,
      longitude: -0.1916,
      address: '456 Bath Street, London, SW15 2DH'
    },
    createdAt: '2025-09-18T14:30:00Z',
    updatedAt: '2025-09-19T08:15:00Z',
    lastContactDate: '2025-09-19T08:15:00Z',
    nextFollowUpDate: '2025-09-21T14:00:00Z',
    tags: ['bathroom', 'fixtures', 'referral'],
    syncStatus: 'synced'
  },
  {
    id: '3',
    title: 'Office Space Renovation',
    description: 'Complete office refurbishment for small business',
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma@businessco.com',
    phone: '07555123456',
    accountId: 'acc-3',
    ownerId: 'user-1',
    status: 'QUALIFIED',
    priority: 'HIGH',
    estimatedValue: 45000,
    source: 'Cold Call',
    location: {
      latitude: 51.5155,
      longitude: -0.0922,
      address: '789 Business Park, London, EC1A 1BB'
    },
    createdAt: '2025-09-17T11:20:00Z',
    updatedAt: '2025-09-19T07:45:00Z',
    lastContactDate: '2025-09-18T16:30:00Z',
    nextFollowUpDate: '2025-09-22T09:00:00Z',
    tags: ['office', 'commercial', 'qualified'],
    syncStatus: 'synced'
  },
  {
    id: '4',
    title: 'Garden Room Extension',
    description: 'New garden room with electrical and plumbing (OFFLINE)',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@email.com',
    phone: '07444555666',
    accountId: 'acc-4',
    ownerId: 'user-3',
    status: 'NEW',
    priority: 'MEDIUM',
    estimatedValue: 18000,
    source: 'Website',
    createdAt: '2025-09-19T10:30:00Z',
    updatedAt: '2025-09-19T10:30:00Z',
    tags: ['extension', 'garden-room'],
    isOffline: true,
    syncStatus: 'pending'
  }
];

export default function EnquiryScreen({ navigation }: EnquiryScreenProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(1);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  // New enquiry form state
  const [newEnquiry, setNewEnquiry] = useState({
    title: '',
    description: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    priority: 'MEDIUM' as Enquiry['priority'],
    estimatedValue: '',
    source: 'Mobile App',
    tags: ''
  });

  useEffect(() => {
    checkNetworkStatus();
    getCurrentLocation();
    setupNotifications();
    
    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [searchQuery, selectedStatus, selectedPriority, enquiries]);

  const checkNetworkStatus = async () => {
    const netInfo = await NetInfo.fetch();
    setIsOnline(netInfo.isConnected ?? false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for enquiry mapping.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Push notifications will be disabled.');
      return;
    }

    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  };

  const filterEnquiries = useCallback(() => {
    let filtered = enquiries;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(enquiry =>
        enquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(enquiry => enquiry.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'ALL') {
      filtered = filtered.filter(enquiry => enquiry.priority === selectedPriority);
    }

    setFilteredEnquiries(filtered);
  }, [enquiries, searchQuery, selectedStatus, selectedPriority]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      if (isOnline) {
        // Simulate API call to sync enquiries
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update sync status for pending enquiries
        setEnquiries(prev => prev.map(enquiry => 
          enquiry.syncStatus === 'pending' 
            ? { ...enquiry, syncStatus: 'synced' as const, isOffline: false }
            : enquiry
        ));
        
        setPendingSyncCount(0);
        
        // Show success notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Sync Complete',
            body: 'All enquiries have been synchronized',
          },
          trigger: null,
        });
      } else {
        Alert.alert('Offline Mode', 'Unable to sync while offline. Data will sync when connection is restored.');
      }
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to synchronize enquiries. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [isOnline]);

  const handleCreateEnquiry = async () => {
    try {
      if (!newEnquiry.title || !newEnquiry.firstName || !newEnquiry.lastName) {
        Alert.alert('Validation Error', 'Please fill in all required fields.');
        return;
      }

      const enquiry: Enquiry = {
        id: `offline-${Date.now()}`,
        ...newEnquiry,
        estimatedValue: parseFloat(newEnquiry.estimatedValue) || 0,
        lastName: newEnquiry.lastName,
        email: newEnquiry.email,
        phone: newEnquiry.phone,
        accountId: 'temp-account',
        ownerId: 'current-user',
        status: 'NEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: newEnquiry.tags ? newEnquiry.tags.split(',').map(tag => tag.trim()) : [],
        isOffline: !isOnline,
        syncStatus: isOnline ? 'synced' : 'pending'
      };

      // Add location if available
      if (currentLocation) {
        enquiry.location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: 'Current Location'
        };
      }

      setEnquiries(prev => [enquiry, ...prev]);
      
      if (!isOnline) {
        setPendingSyncCount(prev => prev + 1);
      }

      // Reset form
      setNewEnquiry({
        title: '',
        description: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        priority: 'MEDIUM',
        estimatedValue: '',
        source: 'Mobile App',
        tags: ''
      });

      setShowCreateModal(false);

      // Show success notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Enquiry Created',
          body: `New enquiry from ${enquiry.firstName} ${enquiry.lastName}`,
        },
        trigger: null,
      });

      Alert.alert(
        'Success', 
        isOnline 
          ? 'Enquiry created successfully!' 
          : 'Enquiry saved offline. It will sync when connection is restored.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create enquiry. Please try again.');
    }
  };

  const getStatusColor = (status: Enquiry['status']) => {
    switch (status) {
      case 'NEW': return '#E3F2FD';
      case 'CONTACTED': return '#FFF3E0';
      case 'QUALIFIED': return '#E8F5E8';
      case 'CONVERTED': return '#E8F5E8';
      case 'LOST': return '#FFEBEE';
      default: return '#F5F5F5';
    }
  };

  const getStatusTextColor = (status: Enquiry['status']) => {
    switch (status) {
      case 'NEW': return '#1976D2';
      case 'CONTACTED': return '#F57C00';
      case 'QUALIFIED': return '#388E3C';
      case 'CONVERTED': return '#388E3C';
      case 'LOST': return '#D32F2F';
      default: return '#616161';
    }
  };

  const getPriorityColor = (priority: Enquiry['priority']) => {
    switch (priority) {
      case 'LOW': return '#4CAF50';
      case 'MEDIUM': return '#FF9800';
      case 'HIGH': return '#F44336';
      case 'URGENT': return '#9C27B0';
      default: return '#757575';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEnquiryPress = (enquiry: Enquiry) => {
    navigation.navigate('EnquiryDetails', { enquiry });
  };

  const handleLocationPress = (location: Enquiry['location']) => {
    if (location) {
      const url = Platform.select({
        ios: `maps:${location.latitude},${location.longitude}`,
        android: `geo:${location.latitude},${location.longitude}?z=16`,
      });
      
      if (url) {
        Alert.alert(
          'Open Location',
          'Open location in maps app?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open', onPress: () => console.log('Open maps:', url) }
          ]
        );
      }
    }
  };

  const renderEnquiryCard = (enquiry: Enquiry) => (
    <Card key={enquiry.id} style={styles.enquiryCard} onPress={() => handleEnquiryPress(enquiry)}>
      <Card.Content>
        <View style={styles.enquiryHeader}>
          <View style={styles.enquiryTitleRow}>
            <Title style={styles.enquiryTitle}>{enquiry.title}</Title>
            {enquiry.isOffline && (
              <MaterialIcons name="cloud-off" size={20} color="#F57C00" />
            )}
            {enquiry.syncStatus === 'pending' && (
              <MaterialIcons name="sync" size={20} color="#2196F3" />
            )}
          </View>
          <View style={styles.statusRow}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(enquiry.status) }]}
              textStyle={{ color: getStatusTextColor(enquiry.status), fontSize: 12 }}
            >
              {enquiry.status}
            </Chip>
            <Chip 
              style={[styles.priorityChip, { backgroundColor: getPriorityColor(enquiry.priority) }]}
              textStyle={{ color: 'white', fontSize: 12 }}
            >
              {enquiry.priority}
            </Chip>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Avatar.Text 
            size={40} 
            label={`${enquiry.firstName.charAt(0)}${enquiry.lastName.charAt(0)}`}
            style={styles.avatar}
          />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>
              {enquiry.firstName} {enquiry.lastName}
            </Text>
            <Text style={styles.customerContact}>
              {enquiry.email} • {enquiry.phone}
            </Text>
          </View>
        </View>

        <Paragraph style={styles.description} numberOfLines={2}>
          {enquiry.description}
        </Paragraph>

        <View style={styles.metadataRow}>
          <View style={styles.valueInfo}>
            <Text style={styles.valueLabel}>Estimated Value:</Text>
            <Text style={styles.valueAmount}>{formatCurrency(enquiry.estimatedValue)}</Text>
          </View>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceLabel}>Source:</Text>
            <Text style={styles.sourceValue}>{enquiry.source}</Text>
          </View>
        </View>

        {enquiry.location && (
          <TouchableOpacity 
            style={styles.locationRow}
            onPress={() => handleLocationPress(enquiry.location)}
          >
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>
              {enquiry.location.address}
            </Text>
          </TouchableOpacity>
        )}

        {enquiry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {enquiry.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
            {enquiry.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{enquiry.tags.length - 3} more</Text>
            )}
          </View>
        )}

        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Created: {formatDate(enquiry.createdAt)}
          </Text>
          {enquiry.nextFollowUpDate && (
            <Text style={styles.followUpText}>
              Next Follow-up: {formatDate(enquiry.nextFollowUpDate)}
            </Text>
          )}
        </View>
      </Card.Content>

      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => console.log('Call', enquiry.phone)}
          icon="phone"
          compact
        >
          Call
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => console.log('Email', enquiry.email)}
          icon="email"
          compact
        >
          Email
        </Button>
        <Button 
          mode="contained" 
          onPress={() => handleEnquiryPress(enquiry)}
          compact
        >
          View
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header with sync status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Title>Enquiries</Title>
          <Text style={styles.subtitle}>
            {filteredEnquiries.length} of {enquiries.length} enquiries
          </Text>
        </View>
        <View style={styles.headerRight}>
          {!isOnline && (
            <Chip 
              icon="cloud-off" 
              style={styles.offlineChip}
              textStyle={styles.offlineText}
            >
              Offline
            </Chip>
          )}
          {pendingSyncCount > 0 && (
            <Badge size={24} style={styles.syncBadge}>
              {pendingSyncCount}
            </Badge>
          )}
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search enquiries..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <View style={styles.filterChips}>
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(status => (
            <Chip
              key={status}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status)}
              style={[styles.filterChip, selectedStatus === status && styles.selectedFilterChip]}
              textStyle={selectedStatus === status ? styles.selectedFilterText : styles.filterText}
            >
              {status}
            </Chip>
          ))}
        </View>
      </ScrollView>

      {/* Enquiries List */}
      <ScrollView
        style={styles.enquiriesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredEnquiries.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No enquiries found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Create your first enquiry to get started'
              }
            </Text>
          </View>
        ) : (
          filteredEnquiries.map(renderEnquiryCard)
        )}
      </ScrollView>

      {/* Create New Enquiry FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowCreateModal(true)}
        label="New Enquiry"
      />

      {/* Create Enquiry Modal */}
      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Create New Enquiry</Title>
            
            <TextInput
              label="Title *"
              value={newEnquiry.title}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, title: text }))}
              style={styles.textInput}
              mode="outlined"
            />

            <TextInput
              label="Description"
              value={newEnquiry.description}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, description: text }))}
              style={styles.textInput}
              mode="outlined"
              multiline
              numberOfLines={3}
            />

            <View style={styles.nameRow}>
              <TextInput
                label="First Name *"
                value={newEnquiry.firstName}
                onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, firstName: text }))}
                style={[styles.textInput, styles.halfWidth]}
                mode="outlined"
              />
              <TextInput
                label="Last Name *"
                value={newEnquiry.lastName}
                onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, lastName: text }))}
                style={[styles.textInput, styles.halfWidth]}
                mode="outlined"
              />
            </View>

            <TextInput
              label="Email"
              value={newEnquiry.email}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, email: text }))}
              style={styles.textInput}
              mode="outlined"
              keyboardType="email-address"
            />

            <TextInput
              label="Phone"
              value={newEnquiry.phone}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, phone: text }))}
              style={styles.textInput}
              mode="outlined"
              keyboardType="phone-pad"
            />

            <TextInput
              label="Estimated Value (£)"
              value={newEnquiry.estimatedValue}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, estimatedValue: text }))}
              style={styles.textInput}
              mode="outlined"
              keyboardType="numeric"
            />

            <TextInput
              label="Tags (comma separated)"
              value={newEnquiry.tags}
              onChangeText={(text) => setNewEnquiry(prev => ({ ...prev, tags: text }))}
              style={styles.textInput}
              mode="outlined"
              placeholder="kitchen, renovation, urgent"
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowCreateModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateEnquiry}
                style={styles.modalButton}
              >
                Create
              </Button>
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  offlineChip: {
    backgroundColor: '#FFF3E0',
  },
  offlineText: {
    color: '#F57C00',
    fontSize: 12,
  },
  syncBadge: {
    backgroundColor: '#2196F3',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
  },
  selectedFilterChip: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#666',
  },
  selectedFilterText: {
    color: 'white',
  },
  enquiriesList: {
    flex: 1,
    padding: 16,
  },
  enquiryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  enquiryHeader: {
    marginBottom: 12,
  },
  enquiryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  enquiryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    height: 32,
  },
  priorityChip: {
    height: 32,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  customerContact: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueInfo: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#666',
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  sourceInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sourceLabel: {
    fontSize: 12,
    color: '#666',
  },
  sourceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  tag: {
    height: 24,
    backgroundColor: '#e3f2fd',
  },
  tagText: {
    fontSize: 11,
    color: '#1976d2',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  dateInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  followUpText: {
    fontSize: 12,
    color: '#f57c00',
    fontWeight: '500',
    marginTop: 2,
  },
  cardActions: {
    paddingTop: 8,
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
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
  textInput: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    minWidth: 80,
  },
});