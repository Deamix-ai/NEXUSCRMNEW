import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  IconButton,
  Avatar,
  Chip,
  ProgressBar,
  Divider,
} from 'react-native-paper';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

interface TodayTask {
  id: string;
  jobId: string;
  jobTitle: string;
  client: string;
  task: string;
  timeSlot: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedDuration: number; // in hours
  address: string;
}

interface WeekStats {
  jobsCompleted: number;
  hoursWorked: number;
  photosUploaded: number;
  clientCalls: number;
}

const mockTodayTasks: TodayTask[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Thompson Kitchen Renovation',
    client: 'Thompson Family',
    task: 'Install kitchen units and worktops',
    timeSlot: '09:00 - 12:00',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    estimatedDuration: 3,
    address: '123 Oak Street, Manchester',
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Williams Bathroom Refit',
    client: 'Williams Residence',
    task: 'Site survey and measurements',
    timeSlot: '14:00 - 16:00',
    priority: 'MEDIUM',
    status: 'PENDING',
    estimatedDuration: 2,
    address: '456 Elm Avenue, Liverpool',
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'Brown Master Suite',
    client: 'Brown Family',
    task: 'Plumbing installation check',
    timeSlot: '16:30 - 17:30',
    priority: 'LOW',
    status: 'PENDING',
    estimatedDuration: 1,
    address: '789 Pine Road, Birmingham',
  },
];

const mockWeekStats: WeekStats = {
  jobsCompleted: 8,
  hoursWorked: 32,
  photosUploaded: 45,
  clientCalls: 12,
};

const priorityColors = {
  LOW: '#4CAF50',
  MEDIUM: '#FF9800',
  HIGH: '#FF5722',
  URGENT: '#F44336',
};

const statusColors = {
  PENDING: '#757575',
  IN_PROGRESS: '#FF9800',
  COMPLETED: '#4CAF50',
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>(mockTodayTasks);
  const [weekStats, setWeekStats] = useState<WeekStats>(mockWeekStats);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Dashboard data has been updated');
    }, 1500);
  };

  const updateTaskStatus = (taskId: string, status: TodayTask['status']) => {
    setTodayTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const navigateToJob = (jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const navigateToPhotoCapture = (jobId: string, jobTitle: string) => {
    navigation.navigate('PhotoCapture', { jobId, jobTitle });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const completedTasks = todayTasks.filter(task => task.status === 'COMPLETED').length;
  const totalTasks = todayTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.greetingSection}>
                <Title style={styles.greeting}>{getGreeting()}, John!</Title>
                <Paragraph style={styles.date}>{getCurrentDate()}</Paragraph>
              </View>
              <Avatar.Text size={60} label="JS" style={styles.avatar} />
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Today's Progress</Text>
                <Text style={styles.progressValue}>
                  {completedTasks}/{totalTasks} tasks
                </Text>
              </View>
              <ProgressBar
                progress={progressPercentage / 100}
                color="#0066CC"
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="check-circle" size={24} iconColor="#4CAF50" />
              <Text style={styles.statNumber}>{weekStats.jobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="clock" size={24} iconColor="#FF9800" />
              <Text style={styles.statNumber}>{weekStats.hoursWorked}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="camera" size={24} iconColor="#2196F3" />
              <Text style={styles.statNumber}>{weekStats.photosUploaded}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => Alert.alert('Camera', 'Quick photo capture')}
                style={styles.actionButton}
              >
                Take Photo
              </Button>
              <Button
                mode="outlined"
                icon="phone"
                onPress={() => Alert.alert('Emergency', 'Emergency contact')}
                style={styles.actionButton}
              >
                Emergency
              </Button>
            </View>
            
            <View style={styles.quickActions}>
              <Button
                mode="outlined"
                icon="map"
                onPress={() => Alert.alert('Navigation', 'Open maps')}
                style={styles.actionButton}
              >
                Navigation
              </Button>
              <Button
                mode="outlined"
                icon="message"
                onPress={() => Alert.alert('Messages', 'Team messages')}
                style={styles.actionButton}
              >
                Messages
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Schedule */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.scheduleHeader}>
              <Title>Today's Schedule</Title>
              <Text style={styles.currentTime}>
                {currentTime.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Divider style={styles.divider} />
            
            {todayTasks.map((task) => (
              <Card key={task.id} style={styles.taskCard}>
                <Card.Content style={styles.taskContent}>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTime}>{formatTime(task.timeSlot)}</Text>
                      <Text style={styles.taskTitle} numberOfLines={1}>
                        {task.jobTitle}
                      </Text>
                      <Text style={styles.taskClient}>{task.client}</Text>
                    </View>
                    
                    <View style={styles.taskStatus}>
                      <Chip
                        mode="flat"
                        style={[
                          styles.priorityChip,
                          { backgroundColor: priorityColors[task.priority] }
                        ]}
                        textStyle={styles.chipText}
                        compact
                      >
                        {task.priority}
                      </Chip>
                      <Chip
                        mode="outlined"
                        style={[
                          styles.statusChip,
                          { borderColor: statusColors[task.status] }
                        ]}
                        textStyle={[
                          styles.chipText,
                          { color: statusColors[task.status] }
                        ]}
                        compact
                      >
                        {task.status.replace('_', ' ')}
                      </Chip>
                    </View>
                  </View>
                  
                  <Text style={styles.taskDescription}>{task.task}</Text>
                  <Text style={styles.taskAddress} numberOfLines={1}>
                    📍 {task.address}
                  </Text>
                  
                  <View style={styles.taskActions}>
                    <Button
                      mode="outlined"
                      icon="eye"
                      onPress={() => navigateToJob(task.jobId)}
                      style={styles.taskActionButton}
                      compact
                    >
                      View Job
                    </Button>
                    
                    <Button
                      mode="outlined"
                      icon="camera"
                      onPress={() => navigateToPhotoCapture(task.jobId, task.jobTitle)}
                      style={styles.taskActionButton}
                      compact
                    >
                      Photo
                    </Button>
                    
                    {task.status === 'PENDING' && (
                      <Button
                        mode="contained"
                        icon="play"
                        onPress={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                        style={styles.taskActionButton}
                        compact
                      >
                        Start
                      </Button>
                    )}
                    
                    {task.status === 'IN_PROGRESS' && (
                      <Button
                        mode="contained"
                        icon="check"
                        onPress={() => updateTaskStatus(task.id, 'COMPLETED')}
                        style={styles.taskActionButton}
                        compact
                      >
                        Done
                      </Button>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>

        {/* Weather Widget */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.weatherHeader}>
              <Title>Weather</Title>
              <View style={styles.weatherInfo}>
                <IconButton icon="weather-partly-cloudy" size={32} />
                <Text style={styles.temperature}>18°C</Text>
              </View>
            </View>
            <Text style={styles.weatherDescription}>
              Partly cloudy, good conditions for outdoor work
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    backgroundColor: '#0066CC',
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
  progressTitle: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 2,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  taskCard: {
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  taskContent: {
    paddingVertical: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  taskClient: {
    fontSize: 14,
    color: '#666',
  },
  taskStatus: {
    alignItems: 'flex-end',
  },
  priorityChip: {
    marginBottom: 4,
  },
  statusChip: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 10,
    color: 'white',
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskActionButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
