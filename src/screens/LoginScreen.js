import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { saveUserSession } from '../services/storage';
import COLORS from '../constants/colors';

export default function LoginScreen({ navigation }) {
  // === Minimal 3 state berbeda (bagian dari requirement teknis) ===
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const newErrors = {};

    if (!nim.trim()) {
      newErrors.nim = 'NIM tidak boleh kosong';
    } else if (!/^\d{6,10}$/.test(nim.trim())) {
      newErrors.nim = 'NIM harus angka, 6-10 digit';
    }

    if (!nama.trim()) {
      newErrors.nama = 'Nama tidak boleh kosong';
    } else if (nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    if (!password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsSubmitting(true);
    const user = {
      nim: nim.trim(),
      nama: nama.trim(),
      loginAt: new Date().toISOString(),
    };

    const success = await saveUserSession(user);
    setIsSubmitting(false);

    if (success) {
      navigation.replace('MainTabs');
    } else {
      setErrors({ general: 'Gagal menyimpan sesi. Coba lagi.' });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>E-Learning Kampus</Text>
          <Text style={styles.subtitle}>Universitas Prima Indonesia</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.formTitle}>Login Mahasiswa</Text>

          <Text style={styles.label}>NIM</Text>
          <TextInput
            style={[styles.input, errors.nim && styles.inputError]}
            placeholder="Contoh: 2201020015"
            keyboardType="numeric"
            value={nim}
            onChangeText={setNim}
          />
          {!!errors.nim && <Text style={styles.errorText}>{errors.nim}</Text>}

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={[styles.input, errors.nama && styles.inputError]}
            placeholder="Nama sesuai KTM"
            value={nama}
            onChangeText={setNama}
          />
          {!!errors.nama && <Text style={styles.errorText}>{errors.nama}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {!!errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {!!errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Masuk</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Data login hanya disimpan lokal di perangkat (AsyncStorage) untuk
            keperluan demo.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 14,
  },
});
