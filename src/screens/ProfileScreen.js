import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserSession, clearUserSession, getProgress } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import COLORS from '../constants/colors';

export default function ProfileScreen({ navigation }) {
  // === Minimal 3 state berbeda ===
  const [user, setUser] = useState(null);
  const [matkulSelesai, setMatkulSelesai] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [session, progressMap] = await Promise.all([
        getUserSession(),
        getProgress(),
      ]);
      setUser(session);
      const selesai = Object.values(progressMap).filter((p) => p >= 100).length;
      setMatkulSelesai(selesai);
      setIsLoading(false);
    })();
  }, []);

  function handleLogout() {
    Alert.alert('Konfirmasi', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await clearUserSession();
          navigation.replace('Login');
        },
      },
    ]);
  }

  if (isLoading) {
    return <LoadingSpinner label="Memuat profil..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nama ? user.nama.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.nama}>{user?.nama || 'Mahasiswa'}</Text>
        <Text style={styles.nim}>NIM: {user?.nim || '-'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{matkulSelesai}</Text>
          <Text style={styles.statLabel}>Matkul Selesai</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {user?.loginAt ? new Date(user.loginAt).toLocaleDateString('id-ID') : '-'}
          </Text>
          <Text style={styles.statLabel}>Login Terakhir</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Tentang Aplikasi</Text>
        <Text style={styles.infoText}>
          E-Learning Kampus — Universitas Prima Indonesia{'\n'}
          Mata Kuliah: Pemrograman Mobile (TI-MOBILE-01){'\n'}
          Dibangun dengan React Native + Expo
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Keluar</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  nama: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  nim: {
    color: '#E0E7FF',
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginTop: 0,
    borderRadius: 14,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
