import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Searchbar,
  FAB,
  Text,
  ProgressBar,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';

interface Job {
  id: string;
  title: string;
  client: string;
  address: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  progress: number;
  startDate: string;
  expectedEndDate: string;
  assignedWorkers: string[];
  nextTask: string;
  estimatedHours: number;
  completedHours: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Thompson Kitchen Renovation',
    client: 'Thompson Family',
    address: '123 Oak Street, Manchester',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 65,
    startDate: '2025-01-15',
    expectedEndDate: '2025-02-28',
    assignedWorkers: ['John Smith', 'Mike Jones'],
    nextTask: 'Install kitchen units',
    estimatedHours: 120,
    completedHours: 78,
  },
  {
    id: '2',
    title: 'Williams Bathroom Refit',
    client: 'Williams Residence',
    address: '456 Elm Avenue, Liverpool',
    status: 'PLANNING',
    priority: 'MEDIUM',
    progress: 0,
    startDate: '2025-02-01',
    expectedEndDate: '2025-02-15',
    assignedWorkers: ['Sarah Connor'],
    nextTask: 'Site survey and measurements',
    estimatedHours: 80,
    completedHours: 0,
  },
  {
    id: '3',
    title: 'Brown Master Suite',
    client: 'Brown Family',
    address: '789 Pine Road, Birmingham',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    progress: 30,
    startDate: '2025-01-20',
    expectedEndDate: '2025-03-15',
    assignedWorkers: ['Tom Wilson'],
    nextTask: 'Plumbing installation',
    estimatedHours: 160,
    completedHours: 48,
  },
  {
    id: '4',
    title: 'Davis Kitchen Extension',
    client: 'Davis Construction',
    address: '321 Cedar Close, Leeds',
    status: 'ON_HOLD',
    priority: 'URGENT',
    progress: 45,
    startDate: '2025-01-10',
    expectedEndDate: '2025-02-20',
    assignedWorkers: ['John Smith', 'Mike Jones', 'Sarah Connor'],
    nextTask: 'Awaiting material delivery',
    estimatedHours: 200,
    completedHours: 90,
  },
  {
    id: '5',
    title: 'Johnson Bathroom Upgrade',
    client: 'Johnson Household',
    address: '654 Birch Lane, Glasgow',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    progress: 100,
    startDate: '2024-12-15',
    expectedEndDate: '2025-01-10',
    assignedWorkers: ['Tom Wilson'],
    nextTask: 'Project completed',
    estimatedHours: 60,
    completedHours: 58,
  },
];

const statusColors = {
  PLANNING: '#2196F3',
  IN_PROGRESS: '#FF9800',
  COMPLETED: '#4CAF50',
  ON_HOLD: '#F44336',
};

const priorityColors = {
  LOW: '#4CAF50',
  MEDIUM: '#FF9800',
  HIGH: '#FF5722',
  URGENT: '#F44336',
};

interface JobsListScreenProps {
  navigation: any;
}

export default function JobsListScreen({ navigation }: JobsListScreenProps) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedFilter, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    // Apply status filter
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(job => job.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Jobs list has been updated');
    }, 1500);
  };

  const navigateToJobDetails = (jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'calendar-clock';
      case 'IN_PROGRESS': return 'hammer-wrench';
      case 'COMPLETED': return 'check-circle';
      case 'ON_HOLD': return 'pause-circle';
      default: return 'circle';
    }
  };

  const renderJobCard = (job: Job) => (
    <Card key={job.id} style={styles.jobCard} onPress={() => navigateToJobDetails(job.id)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleSection}>
            <Title style={styles.jobTitle} numberOfLines={1}>
              {job.title}
            </Title>
            <Paragraph style={styles.clientName}>{job.client}</Paragraph>
          </View>
          <View style={styles.statusSection}>
            <Chip
              icon={getStatusIcon(job.status)}
              mode="flat"
              style={[styles.statusChip, { backgroundColor: statusColors[job.status] }]}
              textStyle={styles.chipText}
              compact
            >
              {job.status.replace('_', ' ')}
            </Chip>
            <Chip
              mode="outlined"
              style={[styles.priorityChip, { borderColor: priorityColors[job.priority] }]}
              textStyle={[styles.chipText, { color: priorityColors[job.priority] }]}
              compact
            >
              {job.priority}
            </Chip>
          </View>
        </View>

        <View style={styles.addressSection}>
          <IconButton icon="map-marker" size={16} style={styles.addressIcon} />
          <Paragraph style={styles.address} numberOfLines={1}>
            {job.address}
          </Paragraph>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{job.progress}%</Text>
          </View>
          <ProgressBar
            progress={job.progress / 100}
            color={statusColors[job.status]}
            style={styles.progressBar}
          />
        </View>

        <View style={styles.taskSection}>
          <Text style={styles.nextTaskLabel}>Next Task:</Text>
          <Text style={styles.nextTask}>{job.nextTask}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Start</Text>
            <Text style={styles.detailValue}>{formatDate(job.startDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>End</Text>
            <Text style={styles.detailValue}>{formatDate(job.expectedEndDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hours</Text>
            <Text style={styles.detailValue}>
              {job.completedHours}/{job.estimatedHours}
            </Text>
          </View>
        </View>

        <View style={styles.workersSection}>
          <Text style={styles.workersLabel}>Assigned:</Text>
          <View style={styles.workersList}>
            {job.assignedWorkers.map((worker, index) => (
              <Chip key={index} style={styles.workerChip} compact>
                {worker}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Menu
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              onPress={() => setFilterVisible(true)}
              style={styles.filterButton}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedFilter('ALL');
              setFilterVisible(false);
            }}
            title="All Jobs"
            leadingIcon="view-list"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSelectedFilter('PLANNING');
              setFilterVisible(false);
            }}
            title="Planning"
            leadingIcon="calendar-clock"
          />
          <Menu.Item
            onPress={() => {
              setSelectedFilter('IN_PROGRESS');
              setFilterVisible(false);
            }}
            title="In Progress"
            leadingIcon="hammer-wrench"
          />
          <Menu.Item
            onPress={() => {
              setSelectedFilter('ON_HOLD');
              setFilterVisible(false);
            }}
            title="On Hold"
            leadingIcon="pause-circle"
          />
          <Menu.Item
            onPress={() => {
              setSelectedFilter('COMPLETED');
              setFilterVisible(false);
            }}
            title="Completed"
            leadingIcon="check-circle"
          />
        </Menu>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {jobs.filter(j => j.status === 'IN_PROGRESS').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {jobs.filter(j => j.status === 'PLANNING').length}
            </Text>
            <Text style={styles.statLabel}>Planned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {jobs.filter(j => j.status === 'COMPLETED').length}
            </Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : 'No jobs match the current filter'}
            </Text>
          </View>
        ) : (
          filteredJobs.map(renderJobCard)
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => Alert.alert('Add Job', 'Create new job functionality')}
        label="New Job"
      />
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
    padding: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    margin: 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  jobCard: {
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#666',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 4,
  },
  priorityChip: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 10,
    color: 'white',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressIcon: {
    margin: 0,
    marginRight: 4,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  taskSection: {
    marginBottom: 12,
  },
  nextTaskLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  nextTask: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  workersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workersLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  workersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  workerChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0066CC',
  },
});
