import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Text,
  IconButton,
  FAB,
  Card,
  TextInput,
  Button,
  Modal,
  Portal,
} from 'react-native-paper';
import { Camera, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

interface PhotoCaptureScreenProps {
  route?: {
    params?: {
      jobId?: string;
      jobTitle?: string;
    };
  };
  navigation?: any;
}

interface CapturedPhoto {
  uri: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

export default function PhotoCaptureScreen({ route, navigation }: PhotoCaptureScreenProps) {
  const jobId = route?.params?.jobId || '1';
  const jobTitle = route?.params?.jobTitle || 'Photo Capture';
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [photoDescription, setPhotoDescription] = useState('');
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    // Get camera permissions
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    
    // Get media library permissions
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    
    // Get location permissions
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    
    setHasPermission(cameraStatus.status === 'granted' && mediaLibraryStatus.status === 'granted');
    
    if (locationStatus.status === 'granted') {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
      } catch (error) {
        console.log('Error getting location:', error);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: true,
        });
        
        if (photo) {
          const photoData: CapturedPhoto = {
            uri: photo.uri,
            timestamp: new Date().toISOString(),
            ...(location && {
              location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            }),
          };
          
          setCapturedPhoto(photoData);
          setShowDescriptionModal(true);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        console.error('Error taking picture:', error);
      }
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    setIsSaving(true);
    try {
      // Save to device gallery
      const asset = await MediaLibrary.createAssetAsync(capturedPhoto.uri);
      
      // Here you would typically upload to your API
      // await uploadPhotoToAPI(capturedPhoto, photoDescription, jobId);
      
      Alert.alert(
        'Success',
        'Photo saved successfully!',
        [
          {
            text: 'Take Another',
            onPress: () => {
              setCapturedPhoto(null);
              setPhotoDescription('');
              setShowDescriptionModal(false);
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo. Please try again.');
      console.error('Error saving photo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoDescription('');
    setShowDescriptionModal(false);
  };

  const toggleCameraType = () => {
    setCameraType(current => current === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on': return 'flash';
      case 'auto': return 'flash-auto';
      case 'off': return 'flash-off';
      default: return 'flash-off';
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to take photos
        </Text>
        <Button mode="contained" onPress={getPermissions}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
        
        <View style={styles.previewOverlay}>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.timestamp}>
            {new Date(capturedPhoto.timestamp).toLocaleString()}
          </Text>
          {capturedPhoto.location && (
            <Text style={styles.location}>
              📍 {capturedPhoto.location.latitude.toFixed(6)}, {capturedPhoto.location.longitude.toFixed(6)}
            </Text>
          )}
        </View>

        <View style={styles.previewControls}>
          <FAB
            style={[styles.previewFab, styles.retakeFab]}
            icon="camera-retake"
            onPress={retakePhoto}
            size="medium"
          />
          <FAB
            style={[styles.previewFab, styles.saveFab]}
            icon="check"
            onPress={() => setShowDescriptionModal(true)}
            size="medium"
          />
        </View>

        <Portal>
          <Modal
            visible={showDescriptionModal}
            onDismiss={() => setShowDescriptionModal(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Card>
              <Card.Content>
                <Text style={styles.modalTitle}>Add Photo Description</Text>
                <TextInput
                  label="Description"
                  value={photoDescription}
                  onChangeText={setPhotoDescription}
                  multiline
                  numberOfLines={3}
                  style={styles.descriptionInput}
                  placeholder="Describe what this photo shows (optional)"
                />
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={retakePhoto}
                    style={styles.modalButton}
                  >
                    Retake
                  </Button>
                  <Button
                    mode="contained"
                    onPress={savePhoto}
                    loading={isSaving}
                    disabled={isSaving}
                    style={styles.modalButton}
                  >
                    Save Photo
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flash}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <IconButton
              icon="close"
              iconColor="white"
              size={30}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.jobTitleOverlay}>{jobTitle}</Text>
            <IconButton
              icon={getFlashIcon()}
              iconColor="white"
              size={30}
              onPress={toggleFlash}
            />
          </View>

          <View style={styles.centerGuide}>
            <View style={styles.guideLine} />
            <View style={[styles.guideLine, styles.guideLineVertical]} />
          </View>

          <View style={styles.bottomControls}>
            <IconButton
              icon="camera-flip"
              iconColor="white"
              size={30}
              onPress={toggleCameraType}
            />
            <FAB
              style={styles.captureButton}
              icon="camera"
              onPress={takePicture}
              size="large"
            />
            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  jobTitleOverlay: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  jobTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
  },
  guideLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  guideLineVertical: {
    width: 2,
    height: 30,
    position: 'absolute',
    top: -14,
    left: 14,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  captureButton: {
    backgroundColor: '#0066CC',
  },
  placeholder: {
    width: 60,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 8,
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  previewFab: {
    backgroundColor: 'white',
  },
  retakeFab: {
    backgroundColor: '#F44336',
  },
  saveFab: {
    backgroundColor: '#4CAF50',
  },
  timestamp: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  location: {
    color: 'white',
    fontSize: 12,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
