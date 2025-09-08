import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ProgressBar,
  Divider,
  IconButton,
  FAB,
} from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

interface JobDetailsProps {
  route?: {
    params?: {
      jobId?: string;
    };
  };
  navigation?: any;
}

interface Photo {
  id: string;
  uri: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

interface Job {
  id: string;
  title: string;
  client: string;
  address: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  startDate: string;
  expectedEndDate: string;
  description: string;
  rooms: string[];
  notes: string;
  photos: Photo[];
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    description: string;
  }[];
}

const mockJob: Job = {
  id: '1',
  title: 'Thompson Kitchen Renovation',
  client: 'Thompson Family',
  address: '123 Oak Street, Manchester, M1 1AA',
  status: 'IN_PROGRESS',
  progress: 65,
  startDate: '2025-09-01',
  expectedEndDate: '2025-10-15',
  description: 'Complete kitchen renovation with island and premium appliances',
  rooms: ['Kitchen'],
  notes: 'Client requested premium finishes throughout',
  photos: [
    {
      id: '1',
      uri: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=Before',
      timestamp: '2025-09-01T09:00:00Z',
      description: 'Before - Original kitchen layout',
    },
    {
      id: '2',
      uri: 'https://via.placeholder.com/300x200/FF6600/FFFFFF?text=Progress',
      timestamp: '2025-09-05T14:30:00Z',
      description: 'Demolition completed',
    },
  ],
  tasks: [
    { id: '1', title: 'Demolition', completed: true, description: 'Remove old kitchen units' },
    { id: '2', title: 'Electrical work', completed: true, description: 'Install new electrical points' },
    { id: '3', title: 'Plumbing', completed: false, description: 'Install new plumbing for island' },
    { id: '4', title: 'Install units', completed: false, description: 'Fit new kitchen units' },
    { id: '5', title: 'Worktops', completed: false, description: 'Template and fit worktops' },
    { id: '6', title: 'Final finish', completed: false, description: 'Install appliances and final touches' },
  ],
};

const statusColors = {
  PLANNING: '#2196F3',
  IN_PROGRESS: '#FF9800',
  COMPLETED: '#4CAF50',
  ON_HOLD: '#F44336',
};

export default function JobDetailsScreen({ route, navigation }: JobDetailsProps) {
  const [job, setJob] = useState<Job>(mockJob);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getCameraPermissions();
    getLocationPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(cameraStatus.status === 'granted' && mediaLibraryStatus.status === 'granted');
  };

  const getLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  };

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }
    setShowCamera(true);
  };

  const toggleTask = (taskId: string) => {
    setJob(prevJob => ({
      ...prevJob,
      tasks: prevJob.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));

    // Recalculate progress
    const completedTasks = job.tasks.filter(task => task.completed).length;
    const totalTasks = job.tasks.length;
    const newProgress = Math.round((completedTasks / totalTasks) * 100);
    
    setJob(prevJob => ({ ...prevJob, progress: newProgress }));
  };

  const updateJobStatus = (status: Job['status']) => {
    setJob(prevJob => ({ ...prevJob, status }));
    Alert.alert('Success', `Job status updated to ${status.replace('_', ' ')}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const completedTasks = job.tasks.filter(task => task.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Job Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Title style={styles.jobTitle}>{job.title}</Title>
                <Paragraph style={styles.clientName}>{job.client}</Paragraph>
                <Paragraph style={styles.address}>{job.address}</Paragraph>
              </View>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: statusColors[job.status] }]}
                textStyle={styles.statusText}
              >
                {job.status.replace('_', ' ')}
              </Chip>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressValue}>{job.progress}%</Text>
              </View>
              <ProgressBar progress={job.progress / 100} color="#0066CC" style={styles.progressBar} />
              <Text style={styles.tasksProgress}>
                {completedTasks} of {job.tasks.length} tasks completed
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Project Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Project Details</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Start Date:</Text>
              <Text style={styles.detailValue}>{formatDate(job.startDate)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expected End:</Text>
              <Text style={styles.detailValue}>{formatDate(job.expectedEndDate)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rooms:</Text>
              <View style={styles.roomChips}>
                {job.rooms.map((room, index) => (
                  <Chip key={index} style={styles.roomChip} compact>
                    {room}
                  </Chip>
                ))}
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{job.description}</Text>
            </View>
            
            {job.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{job.notes}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Task List */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Tasks</Title>
            <Divider style={styles.divider} />
            
            {job.tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
                <IconButton
                  icon={task.completed ? 'check-circle' : 'circle-outline'}
                  iconColor={task.completed ? '#4CAF50' : '#757575'}
                  size={24}
                  onPress={() => toggleTask(task.id)}
                />
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Photos */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.photosHeader}>
              <Title>Progress Photos</Title>
              <Button mode="contained" onPress={takePhoto} icon="camera">
                Take Photo
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            <View style={styles.photosGrid}>
              {job.photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <Text style={styles.photoDescription}>{photo.description}</Text>
                  <Text style={styles.photoTimestamp}>
                    {new Date(photo.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Status Update Buttons */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Update Status</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.statusButtons}>
              <Button
                mode="outlined"
                onPress={() => updateJobStatus('IN_PROGRESS')}
                style={styles.statusButton}
                disabled={job.status === 'IN_PROGRESS'}
              >
                Start Work
              </Button>
              <Button
                mode="outlined"
                onPress={() => updateJobStatus('ON_HOLD')}
                style={styles.statusButton}
                disabled={job.status === 'ON_HOLD'}
              >
                Put On Hold
              </Button>
              <Button
                mode="contained"
                onPress={() => updateJobStatus('COMPLETED')}
                style={styles.statusButton}
                disabled={job.status === 'COMPLETED'}
              >
                Mark Complete
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="phone"
        onPress={() => Alert.alert('Contact', 'Call client functionality')}
        label="Call Client"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: '#888',
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  tasksProgress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    flex: 1,
    color: '#666',
  },
  roomChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  roomChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: (width - 64) / 2,
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  photoTimestamp: {
    fontSize: 10,
    color: '#888',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    width: '48%',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0066CC',
  },
});
