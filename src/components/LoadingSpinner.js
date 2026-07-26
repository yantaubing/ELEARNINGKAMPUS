import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function LoadingSpinner({ label = 'Memuat data...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  label: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
});
