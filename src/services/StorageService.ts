import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import CryptoJS from 'react-native-crypto-js';

const PHOTOS_KEY = '@vault_photos';
const ALBUMS_KEY = '@vault_albums';
const DECOY_PHOTOS_KEY = '@decoy_photos';
const VAULT_DIR = `${RNFS.DocumentDirectoryPath}/vault`;
const DECOY_DIR = `${RNFS.DocumentDirectoryPath}/decoy`;

export interface Photo {
  id: string;
  uri: string;
  encryptedPath: string;
  thumbnail: string;
  albumId?: string;
  createdAt: number;
  fileName: string;
}

export interface Album {
  id: string;
  name: string;
  coverPhoto?: string;
  createdAt: number;
  photoCount: number;
}

class StorageService {
  constructor() {
    this.initializeDirectories();
  }

  // Initialize vault directories
  private async initializeDirectories(): Promise<void> {
    try {
      const vaultExists = await RNFS.exists(VAULT_DIR);
      if (!vaultExists) {
        await RNFS.mkdir(VAULT_DIR);
      }

      const decoyExists = await RNFS.exists(DECOY_DIR);
      if (!decoyExists) {
        await RNFS.mkdir(DECOY_DIR);
      }
    } catch (error) {
      console.error('Error initializing directories:', error);
    }
  }

  // Encryption/Decryption
  private encryptData(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  private decryptData(encryptedData: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Photo Management
  async addPhoto(
    sourceUri: string,
    albumId?: string,
    isDecoy: boolean = false
  ): Promise<Photo | null> {
    try {
      const photoId = this.generateId();
      const fileName = `photo_${photoId}.enc`;
      const targetDir = isDecoy ? DECOY_DIR : VAULT_DIR;
      const encryptedPath = `${targetDir}/${fileName}`;

      // Read original file
      const fileData = await RNFS.readFile(sourceUri, 'base64');

      // Encrypt and save
      const encryptedData = this.encryptData(fileData, photoId);
      await RNFS.writeFile(encryptedPath, encryptedData, 'utf8');

      // Create thumbnail (simplified - in production use image processing library)
      const thumbnailPath = `${targetDir}/thumb_${fileName}`;
      await RNFS.copyFile(sourceUri, thumbnailPath);

      const photo: Photo = {
        id: photoId,
        uri: sourceUri,
        encryptedPath,
        thumbnail: thumbnailPath,
        albumId,
        createdAt: Date.now(),
        fileName: sourceUri.split('/').pop() || 'photo.jpg',
      };

      // Save to storage
      const storageKey = isDecoy ? DECOY_PHOTOS_KEY : PHOTOS_KEY;
      const photos = await this.getPhotos(isDecoy);
      photos.push(photo);
      await AsyncStorage.setItem(storageKey, JSON.stringify(photos));

      // Delete original file for security
      try {
        await RNFS.unlink(sourceUri);
      } catch (e) {
        // Original might be in gallery, ignore error
      }

      return photo;
    } catch (error) {
      console.error('Error adding photo:', error);
      return null;
    }
  }

  async getPhotos(isDecoy: boolean = false): Promise<Photo[]> {
    try {
      const storageKey = isDecoy ? DECOY_PHOTOS_KEY : PHOTOS_KEY;
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting photos:', error);
      return [];
    }
  }

  async getPhotosByAlbum(albumId: string, isDecoy: boolean = false): Promise<Photo[]> {
    try {
      const photos = await this.getPhotos(isDecoy);
      return photos.filter(photo => photo.albumId === albumId);
    } catch (error) {
      return [];
    }
  }

  async deletePhoto(photoId: string, isDecoy: boolean = false): Promise<boolean> {
    try {
      const photos = await this.getPhotos(isDecoy);
      const photo = photos.find(p => p.id === photoId);

      if (!photo) return false;

      // Delete encrypted file
      await RNFS.unlink(photo.encryptedPath);
      await RNFS.unlink(photo.thumbnail);

      // Remove from storage
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      const storageKey = isDecoy ? DECOY_PHOTOS_KEY : PHOTOS_KEY;
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedPhotos));

      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  async decryptPhoto(photoId: string, isDecoy: boolean = false): Promise<string | null> {
    try {
      const photos = await this.getPhotos(isDecoy);
      const photo = photos.find(p => p.id === photoId);

      if (!photo) return null;

      const encryptedData = await RNFS.readFile(photo.encryptedPath, 'utf8');
      const decryptedData = this.decryptData(encryptedData, photoId);

      // Save temporarily for viewing
      const tempPath = `${RNFS.CachesDirectoryPath}/temp_${photoId}.jpg`;
      await RNFS.writeFile(tempPath, decryptedData, 'base64');

      return tempPath;
    } catch (error) {
      console.error('Error decrypting photo:', error);
      return null;
    }
  }

  // Album Management
  async createAlbum(name: string): Promise<Album | null> {
    try {
      const album: Album = {
        id: this.generateId(),
        name,
        createdAt: Date.now(),
        photoCount: 0,
      };

      const albums = await this.getAlbums();
      albums.push(album);
      await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));

      return album;
    } catch (error) {
      console.error('Error creating album:', error);
      return null;
    }
  }

  async getAlbums(): Promise<Album[]> {
    try {
      const data = await AsyncStorage.getItem(ALBUMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  async deleteAlbum(albumId: string): Promise<boolean> {
    try {
      // Delete all photos in album
      const photos = await this.getPhotosByAlbum(albumId);
      for (const photo of photos) {
        await this.deletePhoto(photo.id);
      }

      // Remove album
      const albums = await this.getAlbums();
      const updatedAlbums = albums.filter(a => a.id !== albumId);
      await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(updatedAlbums));

      return true;
    } catch (error) {
      return false;
    }
  }

  async updateAlbumPhotoCount(albumId: string): Promise<void> {
    try {
      const albums = await this.getAlbums();
      const photos = await this.getPhotosByAlbum(albumId);
      
      const updatedAlbums = albums.map(album => {
        if (album.id === albumId) {
          return {
            ...album,
            photoCount: photos.length,
            coverPhoto: photos[0]?.thumbnail,
          };
        }
        return album;
      });

      await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(updatedAlbums));
    } catch (error) {
      console.error('Error updating album photo count:', error);
    }
  }

  // Export photo back to gallery
  async exportPhoto(photoId: string, isDecoy: boolean = false): Promise<boolean> {
    try {
      const decryptedPath = await this.decryptPhoto(photoId, isDecoy);
      if (!decryptedPath) return false;

      const exportPath = `${RNFS.PicturesDirectoryPath}/exported_${Date.now()}.jpg`;
      await RNFS.copyFile(decryptedPath, exportPath);
      await RNFS.unlink(decryptedPath); // Clean up temp file

      return true;
    } catch (error) {
      console.error('Error exporting photo:', error);
      return false;
    }
  }

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([PHOTOS_KEY, ALBUMS_KEY, DECOY_PHOTOS_KEY]);
      await RNFS.unlink(VAULT_DIR);
      await RNFS.unlink(DECOY_DIR);
      await this.initializeDirectories();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();
