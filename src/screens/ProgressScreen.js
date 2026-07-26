import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveTugasUpload, getTugasUploads, getProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';

export default function ProgressScreen({ route }) {
  // === Minimal 3 state berbeda ===
  const [uploads, setUploads] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [tugasList, progressMap] = await Promise.all([
      getTugasUploads(),
      getProgress(),
    ]);
    setUploads(tugasList);

    const values = Object.values(progressMap);
    const avg = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;
    setOverallProgress(avg);
    setIsLoading(false);
  }

  async function handlePickImage() {
    // Wajib: handle permission request dan denied state
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin akses galeri untuk mengunggah foto tugas. Silakan aktifkan izin di pengaturan HP.'
      );
      return;
    }

    setPermissionDenied(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const newEntry = {
        id: Date.now().toString(),
        uri: asset.uri,
        matkul: route.params?.fromMatkul || 'Umum',
        uploadedAt: new Date().toISOString(),
      };
      const updated = await saveTugasUpload(newEntry);
      setUploads(updated);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.uploadCard}>
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.uploadMatkul}>{item.matkul}</Text>
          <Text style={styles.uploadDate}>
            {new Date(item.uploadedAt).toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Belajar</Text>
        <Text style={styles.overall}>Rata-rata: {overallProgress}%</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
        <Text style={styles.uploadButtonText}>📷 Upload Foto Tugas</Text>
      </TouchableOpacity>

      {permissionDenied && (
        <Text style={styles.deniedText}>
          Izin galeri ditolak. Beberapa fitur tidak akan berfungsi.
        </Text>
      )}

      {isLoading ? (
        <LoadingSpinner label="Memuat riwayat tugas..." />
      ) : uploads.length === 0 ? (
        <EmptyState
          icon="📤"
          title="Belum ada tugas diunggah"
          subtitle="Tekan tombol di atas untuk mengunggah foto tugas pertamamu"
        />
      ) : (
        <FlatList
          data={uploads}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  overall: {
    color: '#E0E7FF',
    fontSize: 13,
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: COLORS.secondary,
    margin: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  deniedText: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  uploadCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  uploadMatkul: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  uploadDate: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
