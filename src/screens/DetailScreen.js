import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { fetchMatkulById } from '../services/api';
import { getProgress, updateProgressForCourse } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import COLORS from '../constants/colors';

export default function DetailScreen({ route, navigation }) {
  const { matkulId } = route.params;

  // === Minimal 3 state berbeda ===
  const [matkul, setMatkul] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [data, progressMap] = await Promise.all([
        fetchMatkulById(matkulId),
        getProgress(),
      ]);
      setMatkul(data);
      setProgress(progressMap[matkulId] || 0);
      setIsLoading(false);
    })();
  }, [matkulId]);

  async function tandaiSelesai(materiIndex, totalMateri) {
    const newPercent = Math.min(
      100,
      Math.round(((materiIndex + 1) / totalMateri) * 100)
    );
    setProgress(newPercent);
    await updateProgressForCourse(matkulId, newPercent);
  }

  if (isLoading) {
    return <LoadingSpinner label="Memuat detail mata kuliah..." />;
  }

  if (!matkul) {
    return (
      <View style={styles.notFound}>
        <Text>Mata kuliah tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Text style={styles.kode}>{matkul.kode}</Text>
        <Text style={styles.nama}>{matkul.nama}</Text>
        <Text style={styles.meta}>👤 {matkul.dosen} · {matkul.sks} SKS</Text>
        <Text style={styles.meta}>🕒 {matkul.jadwal}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.deskripsi}>{matkul.deskripsi}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.progressRow}>
          <Text style={styles.sectionTitle}>Progress Belajar</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materi Pembelajaran</Text>
        {matkul.materi.map((m, index) => (
          <TouchableOpacity
            key={index}
            style={styles.materiItem}
            onPress={() => tandaiSelesai(index, matkul.materi.length)}
          >
            <Text style={styles.materiIndex}>{index + 1}</Text>
            <Text style={styles.materiText}>{m}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.hint}>Tap materi untuk menandai sudah dipelajari</Text>
      </View>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() =>
          navigation.navigate('MainTabs', {
            screen: 'Progres',
            params: { fromMatkul: matkul.nama },
          })
        }
      >
        <Text style={styles.uploadButtonText}>📤 Upload Tugas untuk Matkul Ini</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  kode: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '700',
  },
  nama: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  meta: {
    color: '#E0E7FF',
    fontSize: 13,
    marginTop: 6,
  },
  section: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 0,
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  deskripsi: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.success,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  materiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  materiIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
  },
  materiText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
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
});
