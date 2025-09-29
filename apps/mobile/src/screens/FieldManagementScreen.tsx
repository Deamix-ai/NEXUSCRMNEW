import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  IconButton,
  Chip,
  FAB,
  Portal,
  Modal,
  TextInput,
  Divider,
  ActivityIndicator,
  Badge,
  Switch,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera/legacy';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';

const { width, height } = Dimensions.get('window');

interface FieldTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'INSPECTION' | 'MEASUREMENT' | 'PHOTO' | 'SURVEY' | 'MAINTENANCE' | 'INSTALLATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  assignedTo: string;
  dueDate: string;
  estimatedDuration: number; // in minutes
  location: {
    latitude: number;
    longitude: number;
    address: string;
    floor?: string;
    room?: string;
    zone?: string;
  };
  requirements: string[];
  photos: Photo[];
  measurements: Measurement[];
  notes: Note[];
  checklist: ChecklistItem[];
  weather?: WeatherCondition;
  isOffline?: boolean;
  syncStatus?: 'pending' | 'synced' | 'error';
  gpsAccuracy?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Photo {
  id: string;
  uri: string;
  description: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  metadata?: {
    width: number;
    height: number;
    size: number;
    exif?: any;
  };
  isOffline: boolean;
  syncStatus: 'pending' | 'synced' | 'error';
}

interface Measurement {
  id: string;
  type: 'LENGTH' | 'WIDTH' | 'HEIGHT' | 'AREA' | 'VOLUME' | 'TEMPERATURE' | 'PRESSURE';
  value: number;
  unit: string;
  description: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  accuracy?: number;
  instrument?: string;
  photos?: string[]; // Photo IDs
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  type: 'GENERAL' | 'ISSUE' | 'OBSERVATION' | 'REMINDER';
  photos?: string[]; // Photo IDs
  voiceRecording?: string;
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  photos?: string[]; // Photo IDs
  required: boolean;
}

interface WeatherCondition {
  temperature: number;
  humidity: number;
  conditions: string;
  visibility: number;
  windSpeed: number;
  timestamp: string;
}

interface FieldManagementScreenProps {
  navigation: any;
  route: {
    params: {
      taskId?: string;
    };
  };
}

const mockFieldTasks: FieldTask[] = [
  {
    id: '1',
    projectId: 'proj-1',
    title: 'Kitchen Pre-Installation Survey',
    description: 'Complete survey of kitchen space before installation begins',
    type: 'SURVEY',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'current-user',
    dueDate: '2025-09-20T14:00:00Z',
    estimatedDuration: 120,
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      address: '123 Kitchen Lane, London, SW1A 1AA',
      floor: 'Ground Floor',
      room: 'Kitchen',
      zone: 'Main Area'
    },
    requirements: ['Measuring tape', 'Camera', 'Level', 'Moisture meter'],
    photos: [],
    measurements: [],
    notes: [],
    checklist: [
      {
        id: 'c1',
        description: 'Measure overall room dimensions',
        completed: false,
        required: true
      },
      {
        id: 'c2',
        description: 'Check electrical outlet locations',
        completed: false,
        required: true
      },
      {
        id: 'c3',
        description: 'Inspect plumbing connections',
        completed: false,
        required: true
      },
      {
        id: 'c4',
        description: 'Document existing condition',
        completed: false,
        required: true
      }
    ],
    weather: {
      temperature: 18,
      humidity: 65,
      conditions: 'Partly Cloudy',
      visibility: 10,
      windSpeed: 12,
      timestamp: new Date().toISOString()
    },
    syncStatus: 'synced',
    createdAt: '2025-09-19T08:00:00Z',
    updatedAt: '2025-09-19T10:30:00Z'
  }
];

export default function FieldManagementScreen({ navigation, route }: FieldManagementScreenProps) {
  const [fieldTasks, setFieldTasks] = useState<FieldTask[]>(mockFieldTasks);
  const [currentTask, setCurrentTask] = useState<FieldTask | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  
  const cameraRef = useRef<Camera>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);

  // Form states
  const [newMeasurement, setNewMeasurement] = useState({
    type: 'LENGTH' as Measurement['type'],
    value: '',
    unit: 'mm',
    description: '',
    instrument: 'Measuring Tape'
  });

  const [newNote, setNewNote] = useState({
    content: '',
    type: 'GENERAL' as Note['type']
  });

  useEffect(() => {
    initializeLocation();
    checkNetworkStatus();
    
    // Load task if provided
    if (route.params?.taskId) {
      const task = fieldTasks.find(t => t.id === route.params.taskId);
      if (task) {
        setCurrentTask(task);
      }
    } else if (fieldTasks.length > 0) {
      setCurrentTask(fieldTasks[0]);
    }

    // Network listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
      stopLocationTracking();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for field management.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      setCurrentLocation(location);
      setLocationAccuracy(location.coords.accuracy || null);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get current location.');
    }
  };

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      setIsLocationTracking(true);
      
      locationWatchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          setCurrentLocation(location);
          setLocationAccuracy(location.coords.accuracy || null);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setIsLocationTracking(false);
    }
  };

  const stopLocationTracking = () => {
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }
    setIsLocationTracking(false);
  };

  const checkNetworkStatus = async () => {
    const netInfo = await NetInfo.fetch();
    setIsOnline(netInfo.isConnected ?? false);
  };

  const capturePhoto = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }

      setShowCamera(true);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !currentTask || !currentLocation) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
        skipProcessing: false,
      });

      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        uri: photo.uri,
        description: `Field photo - ${currentTask.title}`,
        timestamp: new Date().toISOString(),
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy || 0
        },
        metadata: {
          width: photo.width || 0,
          height: photo.height || 0,
          size: 0, // Will be calculated when saving
          exif: photo.exif
        },
        isOffline: !isOnline,
        syncStatus: isOnline ? 'synced' : 'pending'
      };

      // Update current task with new photo
      setCurrentTask(prev => prev ? {
        ...prev,
        photos: [...prev.photos, newPhoto],
        updatedAt: new Date().toISOString()
      } : null);

      // Update tasks list
      setFieldTasks(prev => prev.map(task => 
        task.id === currentTask.id 
          ? { ...task, photos: [...task.photos, newPhoto], updatedAt: new Date().toISOString() }
          : task
      ));

      setShowCamera(false);

      // Show notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Photo Captured',
          body: `Photo added to ${currentTask.title}`,
        },
        trigger: null,
      });

    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  const selectPhotoFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0] && currentTask) {
        const asset = result.assets[0];
        
        const newPhoto: Photo = {
          id: `photo-${Date.now()}`,
          uri: asset.uri,
          description: `Gallery photo - ${currentTask.title}`,
          timestamp: new Date().toISOString(),
          metadata: {
            width: asset.width || 0,
            height: asset.height || 0,
            size: asset.fileSize || 0
          },
          isOffline: !isOnline,
          syncStatus: isOnline ? 'synced' : 'pending'
        };

        // Add location if available
        if (currentLocation) {
          newPhoto.location = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy || 0
          };
        }

        // Update current task
        setCurrentTask(prev => prev ? {
          ...prev,
          photos: [...prev.photos, newPhoto],
          updatedAt: new Date().toISOString()
        } : null);

        // Update tasks list
        setFieldTasks(prev => prev.map(task => 
          task.id === currentTask.id 
            ? { ...task, photos: [...task.photos, newPhoto], updatedAt: new Date().toISOString() }
            : task
        ));
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo.');
    }
  };

  const addMeasurement = () => {
    if (!currentTask || !newMeasurement.value || !newMeasurement.description) {
      Alert.alert('Validation Error', 'Please fill in all measurement fields.');
      return;
    }

    const measurement: Measurement = {
      id: `measurement-${Date.now()}`,
      type: newMeasurement.type,
      value: parseFloat(newMeasurement.value),
      unit: newMeasurement.unit,
      description: newMeasurement.description,
      timestamp: new Date().toISOString(),
      instrument: newMeasurement.instrument
    };

    // Add location if available
    if (currentLocation) {
      measurement.location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      };
    }

    // Add accuracy if available
    if (locationAccuracy !== null) {
      measurement.accuracy = locationAccuracy;
    }

    // Update current task
    setCurrentTask(prev => prev ? {
      ...prev,
      measurements: [...prev.measurements, measurement],
      updatedAt: new Date().toISOString()
    } : null);

    // Update tasks list
    setFieldTasks(prev => prev.map(task => 
      task.id === currentTask.id 
        ? { ...task, measurements: [...task.measurements, measurement], updatedAt: new Date().toISOString() }
        : task
    ));

    // Reset form
    setNewMeasurement({
      type: 'LENGTH',
      value: '',
      unit: 'mm',
      description: '',
      instrument: 'Measuring Tape'
    });

    setShowMeasurementModal(false);
  };

  const addNote = () => {
    if (!currentTask || !newNote.content.trim()) {
      Alert.alert('Validation Error', 'Please enter note content.');
      return;
    }

    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNote.content.trim(),
      timestamp: new Date().toISOString(),
      author: 'current-user',
      type: newNote.type
    };

    // Update current task
    setCurrentTask(prev => prev ? {
      ...prev,
      notes: [...prev.notes, note],
      updatedAt: new Date().toISOString()
    } : null);

    // Update tasks list
    setFieldTasks(prev => prev.map(task => 
      task.id === currentTask.id 
        ? { ...task, notes: [...task.notes, note], updatedAt: new Date().toISOString() }
        : task
    ));

    // Reset form
    setNewNote({
      content: '',
      type: 'GENERAL'
    });

    setShowNoteModal(false);
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!currentTask) return;

    const updatedChecklist = currentTask.checklist.map(item => {
      if (item.id === itemId) {
        if (!item.completed) {
          // Completing the item
          return { 
            ...item, 
            completed: true,
            completedAt: new Date().toISOString(),
            completedBy: 'current-user'
          };
        } else {
          // Uncompleting the item - remove optional fields
          const { completedAt, completedBy, ...itemWithoutOptional } = item;
          return {
            ...itemWithoutOptional,
            completed: false
          };
        }
      }
      return item;
    });

    // Update current task
    setCurrentTask(prev => prev ? {
      ...prev,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString()
    } : null);

    // Update tasks list
    setFieldTasks(prev => prev.map(task => 
      task.id === currentTask.id 
        ? { ...task, checklist: updatedChecklist, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const completeTask = async () => {
    if (!currentTask) return;

    const requiredItems = currentTask.checklist.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.completed);

    if (completedRequired.length < requiredItems.length) {
      Alert.alert(
        'Incomplete Task',
        `Please complete all required checklist items (${completedRequired.length}/${requiredItems.length} completed).`,
        [
          { text: 'Continue Working', style: 'cancel' },
          { text: 'Complete Anyway', onPress: () => markTaskComplete() }
        ]
      );
      return;
    }

    markTaskComplete();
  };

  const markTaskComplete = async () => {
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      status: 'COMPLETED' as const,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentTask(updatedTask);
    setFieldTasks(prev => prev.map(task => 
      task.id === currentTask.id ? updatedTask : task
    ));

    // Show completion notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Completed',
        body: `${currentTask.title} has been completed`,
      },
      trigger: null,
    });

    Alert.alert('Task Completed', 'Field task has been marked as complete.');
  };

  const getTaskProgress = () => {
    if (!currentTask) return 0;
    
    const totalItems = currentTask.checklist.length;
    const completedItems = currentTask.checklist.filter(item => item.completed).length;
    
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: FieldTask['status']) => {
    switch (status) {
      case 'PENDING': return '#FFF3E0';
      case 'IN_PROGRESS': return '#E3F2FD';
      case 'COMPLETED': return '#E8F5E8';
      case 'ON_HOLD': return '#FFEBEE';
      default: return '#F5F5F5';
    }
  };

  const getStatusTextColor = (status: FieldTask['status']) => {
    switch (status) {
      case 'PENDING': return '#F57C00';
      case 'IN_PROGRESS': return '#1976D2';
      case 'COMPLETED': return '#388E3C';
      case 'ON_HOLD': return '#D32F2F';
      default: return '#616161';
    }
  };

  if (!currentTask) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="assignment" size={64} color="#ccc" />
        <Text style={styles.emptyStateText}>No Field Tasks</Text>
        <Text style={styles.emptyStateSubtext}>
          No field tasks available for today
        </Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type="back"
          ratio="4:3"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <IconButton
                icon="close"
                iconColor="white"
                size={30}
                onPress={() => setShowCamera(false)}
              />
              <Text style={styles.cameraTitle}>{currentTask.title}</Text>
            </View>
            
            <View style={styles.cameraFooter}>
              <Button
                mode="outlined"
                onPress={selectPhotoFromGallery}
                textColor="white"
                style={styles.galleryButton}
              >
                Gallery
              </Button>
              
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <View style={styles.placeholderButton} />
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.taskInfo}>
            <Title style={styles.taskTitle}>{currentTask.title}</Title>
            <Text style={styles.taskLocation}>{currentTask.location.address}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(currentTask.status) }]}
              textStyle={{ color: getStatusTextColor(currentTask.status) }}
            >
              {currentTask.status}
            </Chip>
            {!isOnline && (
              <MaterialIcons name="cloud-off" size={20} color="#F57C00" />
            )}
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {Math.round(getTaskProgress())}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${getTaskProgress()}%` }]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location & Weather Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>Location & Environment</Title>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="#666" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  {currentTask.location.floor && `${currentTask.location.floor}, `}
                  {currentTask.location.room}
                </Text>
                {locationAccuracy && (
                  <Text style={styles.accuracyText}>
                    GPS Accuracy: ±{Math.round(locationAccuracy)}m
                  </Text>
                )}
              </View>
              <View style={styles.trackingToggle}>
                <Switch 
                  value={isLocationTracking}
                  onValueChange={(value) => value ? startLocationTracking() : stopLocationTracking()}
                />
                <Text style={styles.trackingText}>Track</Text>
              </View>
            </View>
            
            {currentTask.weather && (
              <View style={styles.weatherRow}>
                <MaterialIcons name="wb-sunny" size={20} color="#FFA726" />
                <Text style={styles.weatherText}>
                  {currentTask.weather.temperature}°C, {currentTask.weather.conditions}
                  {currentTask.weather.humidity && ` • ${currentTask.weather.humidity}% humidity`}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Checklist */}
        <Card style={styles.checklistCard}>
          <Card.Content>
            <Title>Task Checklist</Title>
            {currentTask.checklist.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <TouchableOpacity 
                  style={styles.checklistRow}
                  onPress={() => toggleChecklistItem(item.id)}
                >
                  <MaterialIcons 
                    name={item.completed ? "check-box" : "check-box-outline-blank"}
                    size={24} 
                    color={item.completed ? "#4CAF50" : "#999"}
                  />
                  <Text style={[
                    styles.checklistText,
                    item.completed && styles.checklistTextCompleted
                  ]}>
                    {item.description}
                    {item.required && <Text style={styles.requiredText}> *</Text>}
                  </Text>
                </TouchableOpacity>
                {item.completedAt && (
                  <Text style={styles.completedTime}>
                    Completed: {formatDate(item.completedAt)}
                  </Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Photos Section */}
        <Card style={styles.photosCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Photos ({currentTask.photos.length})</Title>
              <Button 
                mode="outlined" 
                icon="camera"
                onPress={capturePhoto}
                compact
              >
                Add Photo
              </Button>
            </View>
            
            {currentTask.photos.length === 0 ? (
              <View style={styles.emptyPhotos}>
                <MaterialIcons name="photo-camera" size={48} color="#ccc" />
                <Text style={styles.emptyPhotosText}>No photos yet</Text>
                <Text style={styles.emptyPhotosSubtext}>Take photos to document progress</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.photosRow}>
                  {currentTask.photos.map((photo, index) => (
                    <TouchableOpacity key={photo.id} style={styles.photoCard}>
                      <View style={styles.photoContainer}>
                        {/* Photo placeholder - would use Image component with photo.uri */}
                        <View style={styles.photoPlaceholder}>
                          <MaterialIcons name="image" size={40} color="#ccc" />
                        </View>
                        {photo.isOffline && (
                          <View style={styles.offlinePhotoIndicator}>
                            <MaterialIcons name="cloud-off" size={12} color="white" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.photoDescription} numberOfLines={2}>
                        {photo.description}
                      </Text>
                      <Text style={styles.photoTime}>
                        {formatDate(photo.timestamp)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </Card.Content>
        </Card>

        {/* Measurements Section */}
        <Card style={styles.measurementsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Measurements ({currentTask.measurements.length})</Title>
              <Button 
                mode="outlined" 
                icon="straighten"
                onPress={() => setShowMeasurementModal(true)}
                compact
              >
                Add
              </Button>
            </View>
            
            {currentTask.measurements.length === 0 ? (
              <View style={styles.emptySection}>
                <MaterialIcons name="straighten" size={48} color="#ccc" />
                <Text style={styles.emptySectionText}>No measurements yet</Text>
              </View>
            ) : (
              currentTask.measurements.map((measurement) => (
                <View key={measurement.id} style={styles.measurementItem}>
                  <View style={styles.measurementHeader}>
                    <Text style={styles.measurementType}>{measurement.type}</Text>
                    <Text style={styles.measurementValue}>
                      {measurement.value} {measurement.unit}
                    </Text>
                  </View>
                  <Text style={styles.measurementDescription}>
                    {measurement.description}
                  </Text>
                  <Text style={styles.measurementTime}>
                    {formatDate(measurement.timestamp)}
                    {measurement.instrument && ` • ${measurement.instrument}`}
                  </Text>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Notes Section */}
        <Card style={styles.notesCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Notes ({currentTask.notes.length})</Title>
              <Button 
                mode="outlined" 
                icon="note-add"
                onPress={() => setShowNoteModal(true)}
                compact
              >
                Add Note
              </Button>
            </View>
            
            {currentTask.notes.length === 0 ? (
              <View style={styles.emptySection}>
                <MaterialIcons name="note" size={48} color="#ccc" />
                <Text style={styles.emptySectionText}>No notes yet</Text>
              </View>
            ) : (
              currentTask.notes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Chip style={styles.noteTypeChip}>{note.type}</Chip>
                    <Text style={styles.noteTime}>{formatDate(note.timestamp)}</Text>
                  </View>
                  <Text style={styles.noteContent}>{note.content}</Text>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Complete Task FAB */}
      {currentTask.status !== 'COMPLETED' && (
        <FAB
          style={[styles.fab, { backgroundColor: getTaskProgress() === 100 ? '#4CAF50' : '#2196F3' }]}
          icon={getTaskProgress() === 100 ? "check" : "assignment-turned-in"}
          label={getTaskProgress() === 100 ? "Complete" : "In Progress"}
          onPress={completeTask}
        />
      )}

      {/* Measurement Modal */}
      <Portal>
        <Modal
          visible={showMeasurementModal}
          onDismiss={() => setShowMeasurementModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Add Measurement</Title>
          
          <TextInput
            label="Type"
            value={newMeasurement.type}
            style={styles.textInput}
            mode="outlined"
            disabled
          />
          
          <View style={styles.measurementRow}>
            <TextInput
              label="Value"
              value={newMeasurement.value}
              onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, value: text }))}
              style={[styles.textInput, styles.measurementValueInput]}
              mode="outlined"
              keyboardType="numeric"
            />
            <TextInput
              label="Unit"
              value={newMeasurement.unit}
              onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, unit: text }))}
              style={[styles.textInput, styles.measurementUnitInput]}
              mode="outlined"
            />
          </View>
          
          <TextInput
            label="Description"
            value={newMeasurement.description}
            onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, description: text }))}
            style={styles.textInput}
            mode="outlined"
            multiline
            numberOfLines={2}
          />
          
          <TextInput
            label="Instrument"
            value={newMeasurement.instrument}
            onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, instrument: text }))}
            style={styles.textInput}
            mode="outlined"
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowMeasurementModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={addMeasurement}
              style={styles.modalButton}
            >
              Add
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Note Modal */}
      <Portal>
        <Modal
          visible={showNoteModal}
          onDismiss={() => setShowNoteModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Add Note</Title>
          
          <TextInput
            label="Note Content"
            value={newNote.content}
            onChangeText={(text) => setNewNote(prev => ({ ...prev, content: text }))}
            style={styles.textInput}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Enter your observations, issues, or reminders..."
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowNoteModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={addNote}
              style={styles.modalButton}
            >
              Add Note
            </Button>
          </View>
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskLocation: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 32,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  trackingToggle: {
    alignItems: 'center',
  },
  trackingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  weatherText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  checklistCard: {
    marginBottom: 16,
    elevation: 2,
  },
  checklistItem: {
    marginVertical: 8,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checklistText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  requiredText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  completedTime: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 36,
    marginTop: 2,
  },
  photosCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyPhotos: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyPhotosText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 8,
  },
  emptyPhotosSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoCard: {
    width: 120,
    marginRight: 8,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: 120,
    height: 90,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  offlinePhotoIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F57C00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  photoTime: {
    fontSize: 10,
    color: '#999',
  },
  measurementsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptySectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 8,
  },
  measurementItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  measurementType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  measurementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  measurementTime: {
    fontSize: 12,
    color: '#999',
  },
  notesCard: {
    marginBottom: 100,
    elevation: 2,
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTypeChip: {
    height: 24,
    backgroundColor: '#e3f2fd',
  },
  noteTime: {
    fontSize: 12,
    color: '#999',
  },
  noteContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
    paddingBottom: 50,
  },
  galleryButton: {
    borderColor: 'white',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
  },
  placeholderButton: {
    width: 70,
    height: 70,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  measurementRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measurementValueInput: {
    flex: 2,
  },
  measurementUnitInput: {
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