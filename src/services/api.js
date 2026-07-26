// Simulasi "API publik" — dalam project nyata bisa diganti fetch() ke REST API.
// Delay ditambahkan sengaja supaya loading state (ActivityIndicator) terlihat jelas.

const DUMMY_MATKUL = [
  {
    id: '1',
    kode: 'TI-MOBILE-01',
    nama: 'Pemrograman Mobile',
    dosen: 'Dr. Andi Saputra, M.Kom',
    sks: 3,
    jadwal: 'Senin, 08:00 - 10:30',
    deskripsi:
      'Mata kuliah yang membahas pengembangan aplikasi mobile menggunakan React Native dan Expo, mencakup navigasi, state management, dan integrasi device feature.',
    materi: [
      'Pengenalan React Native & Expo',
      'Navigasi (Stack & Tab Navigator)',
      'State Management dengan useState & useEffect',
      'AsyncStorage & Local Persistence',
      'Integrasi Kamera & Lokasi',
    ],
  },
  {
    id: '2',
    kode: 'TI-BASDAT-02',
    nama: 'Basis Data Lanjut',
    dosen: 'Sri Wahyuni, S.Kom., M.T.',
    sks: 3,
    jadwal: 'Selasa, 10:30 - 13:00',
    deskripsi:
      'Membahas perancangan basis data relasional lanjutan, normalisasi, indexing, dan optimasi query pada skala besar.',
    materi: [
      'Normalisasi Lanjutan',
      'Indexing & Query Optimization',
      'Transaksi & Concurrency Control',
      'Studi Kasus Basis Data Perusahaan',
    ],
  },
  {
    id: '3',
    kode: 'TI-AI-03',
    nama: 'Kecerdasan Buatan',
    dosen: 'Budi Hartono, Ph.D.',
    sks: 3,
    jadwal: 'Rabu, 13:00 - 15:30',
    deskripsi:
      'Pengantar konsep kecerdasan buatan meliputi pencarian, logika, machine learning dasar, dan penerapannya dalam sistem cerdas.',
    materi: [
      'Pengantar AI & Sejarah',
      'Algoritma Pencarian (Search)',
      'Machine Learning Dasar',
      'Studi Kasus AI di Industri',
    ],
  },
  {
    id: '4',
    kode: 'TI-JARKOM-04',
    nama: 'Jaringan Komputer',
    dosen: 'Rina Marlina, M.T.',
    sks: 2,
    jadwal: 'Kamis, 15:30 - 17:30',
    deskripsi:
      'Membahas konsep dasar jaringan komputer, protokol TCP/IP, subnetting, serta keamanan jaringan.',
    materi: [
      'Model OSI & TCP/IP',
      'Subnetting & IP Addressing',
      'Routing & Switching',
      'Keamanan Jaringan Dasar',
    ],
  },
  {
    id: '5',
    kode: 'TI-UIUX-05',
    nama: 'Desain UI/UX',
    dosen: 'Fajar Ramadhan, S.Ds.',
    sks: 2,
    jadwal: 'Jumat, 08:00 - 10:00',
    deskripsi:
      'Membahas prinsip desain antarmuka pengguna dan pengalaman pengguna, termasuk wireframing, prototyping, dan usability testing.',
    materi: [
      'Prinsip Dasar UI/UX',
      'Wireframing & Prototyping (Figma)',
      'Design System & Konsistensi Visual',
      'Usability Testing',
    ],
  },
];

export function fetchMatkulList() {
  // Simulasi network delay 1.2 detik
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_MATKUL);
    }, 1200);
  });
}

export function fetchMatkulById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_MATKUL.find((m) => m.id === id) || null);
    }, 400);
  });
}
