import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { fetchMatkulList } from '../services/api';
import { getProgress, getUserSession } from '../services/storage';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';

export default function HomeScreen({ navigation }) {
  // === Minimal 3 state berbeda ===
  const [matkulList, setMatkulList] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async () => {
    const [list, progress, user] = await Promise.all([
      fetchMatkulList(),
      getProgress(),
      getUserSession(),
    ]);
    setMatkulList(list);
    setProgressMap(progress);
    if (user?.nama) setUserName(user.nama);
  }, []);

  // useEffect dengan dependency array kosong -> jalan sekali saat mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadAll();
      setIsLoading(false);
    })();
  }, [loadAll]);

  async function onRefresh() {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    return (
      <ItemCard
        matkul={item}
        progress={progressMap[item.id] || 0}
        onPress={() => navigation.navigate('Detail', { matkulId: item.id })}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Halo, {userName || 'Mahasiswa'} 👋
        </Text>
        <Text style={styles.subGreeting}>Mata kuliah semester ini</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner label="Memuat daftar mata kuliah..." />
      ) : matkulList.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Belum ada mata kuliah"
          subtitle="Data mata kuliah akan muncul di sini"
        />
      ) : (
        <FlatList
          data={matkulList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState icon="📚" title="Tidak ada data" />
          }
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
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  subGreeting: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 4,
  },
});
