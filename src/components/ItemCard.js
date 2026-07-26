import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function ItemCard({ matkul, progress = 0, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowTop}>
        <Text style={styles.kode}>{matkul.kode}</Text>
        <Text style={styles.sks}>{matkul.sks} SKS</Text>
      </View>
      <Text style={styles.nama}>{matkul.nama}</Text>
      <Text style={styles.dosen}>👤 {matkul.dosen}</Text>
      <Text style={styles.jadwal}>🕒 {matkul.jadwal}</Text>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{progress}% selesai</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  kode: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sks: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  nama: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  dosen: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  jadwal: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
});
