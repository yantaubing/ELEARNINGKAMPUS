import AsyncStorage from '@react-native-async-storage/async-storage';

// ==== Storage Keys ====
export const STORAGE_KEYS = {
  USER_SESSION: '@elearning_user_session',
  PROGRESS: '@elearning_progress',
  TUGAS: '@elearning_tugas_uploads',
};

// ==== Generic helpers ====
export async function saveData(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.log('Error saving data', e);
    return false;
  }
}

export async function loadData(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Error loading data', e);
    return null;
  }
}

export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log('Error removing data', e);
    return false;
  }
}

// ==== Domain-specific: Sesi user (login) ====
export async function saveUserSession(user) {
  return saveData(STORAGE_KEYS.USER_SESSION, user);
}

export async function getUserSession() {
  return loadData(STORAGE_KEYS.USER_SESSION);
}

export async function clearUserSession() {
  return removeData(STORAGE_KEYS.USER_SESSION);
}

// ==== Domain-specific: Progress belajar per matkul ====
export async function saveProgress(progressMap) {
  return saveData(STORAGE_KEYS.PROGRESS, progressMap);
}

export async function getProgress() {
  const data = await loadData(STORAGE_KEYS.PROGRESS);
  return data || {};
}

export async function updateProgressForCourse(courseId, percent) {
  const current = await getProgress();
  current[courseId] = percent;
  await saveProgress(current);
  return current;
}

// ==== Domain-specific: Upload tugas (foto) ====
export async function saveTugasUpload(tugasEntry) {
  const existing = (await loadData(STORAGE_KEYS.TUGAS)) || [];
  const updated = [tugasEntry, ...existing];
  await saveData(STORAGE_KEYS.TUGAS, updated);
  return updated;
}

export async function getTugasUploads() {
  const data = await loadData(STORAGE_KEYS.TUGAS);
  return data || [];
}
