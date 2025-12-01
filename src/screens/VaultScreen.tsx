import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import StorageService, { Photo } from '../services/StorageService';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 10;

interface VaultScreenProps {
  isDecoy?: boolean;
  onBack: () => void;
}

const VaultScreen: React.FC<VaultScreenProps> = ({ isDecoy = false, onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const loadedPhotos = await StorageService.getPhotos(isDecoy);
    setPhotos(loadedPhotos);
  };

  const handleAddPhotos = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10,
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to select photos');
          return;
        }

        if (response.assets) {
          for (const asset of response.assets) {
            if (asset.uri) {
              await StorageService.addPhoto(asset.uri, undefined, isDecoy);
            }
          }
          loadPhotos();
        }
      }
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deletePhoto(photoId, isDecoy);
            loadPhotos();
          },
        },
      ]
    );
  };

  const handleViewPhoto = async (photo: Photo, index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const handleExportPhoto = async (photoId: string) => {
    const success = await StorageService.exportPhoto(photoId, isDecoy);
    if (success) {
      Alert.alert('Success', 'Photo exported to gallery');
    } else {
      Alert.alert('Error', 'Failed to export photo');
    }
  };

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => handleViewPhoto(item, index)}
      onLongPress={() => setSelectedPhoto(item.id)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.photo} />
      {selectedPhoto === item.id && (
        <View style={styles.photoActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleExportPhoto(item.id)}
          >
            <Icon name="download-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletePhoto(item.id)}
          >
            <Icon name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const imageUrls = photos.map(photo => ({
    url: photo.thumbnail,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isDecoy ? 'Decoy Vault' : 'My Vault'}
        </Text>
        <TouchableOpacity onPress={handleAddPhotos}>
          <Icon name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="images-outline" size={80} color="#666" />
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add photos</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      )}

      <Modal visible={viewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={imageUrls}
          index={viewerIndex}
          onSwipeDown={() => setViewerVisible(false)}
          enableSwipeDown={true}
          backgroundColor="#000"
          renderIndicator={() => null}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setViewerVisible(false)}
        >
          <Icon name="close-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  grid: {
    padding: 5,
  },
  photoContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 25,
    margin: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#444',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default VaultScreen;
