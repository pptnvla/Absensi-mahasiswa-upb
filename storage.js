// ============================================================
// storage.js — Logika penyimpanan data (localStorage)
// ============================================================

// Key yang digunakan untuk menyimpan array JSON di localStorage
const KUNCI_PENYIMPANAN = 'dataAbsensi';

// Fungsi untuk mengambil semua data dari localStorage
// Mengembalikan array objek atau array kosong jika belum ada data
function ambilSemuaData() {
  const dataString = localStorage.getItem(KUNCI_PENYIMPANAN);
  return dataString ? JSON.parse(dataString) : [];
}

// Fungsi untuk menyimpan data baru ke dalam localStorage
function simpanData(dataBaru) {
  const data = ambilSemuaData();
  data.push(dataBaru);
  localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(data));
}

// Fungsi untuk menghapus data berdasarkan indeks
function hapusDataBerdasarkanIndex(index) {
  const data = ambilSemuaData();
  data.splice(index, 1);
  localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(data));
}

// Fungsi untuk menghapus semua data di localStorage
function hapusSemuaData() {
  localStorage.removeItem(KUNCI_PENYIMPANAN);
}
