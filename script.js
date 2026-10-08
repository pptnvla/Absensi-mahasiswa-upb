// ============================================================
// script.js — Logika utama formulir absensi
// ============================================================

// Mengambil elemen dari form
const inputNama   = document.getElementById("nama");
const inputNim    = document.getElementById("nim");
const selectStatus = document.getElementById("status");
const inputTotal  = document.getElementById("totalPertemuan");
const inputHadir  = document.getElementById("jumlahHadir");
const cekTugas    = document.getElementById("tugas");
const btnProses   = document.getElementById("btnProses");
const btnReset    = document.getElementById("btnReset");
const kotakHasil  = document.getElementById("hasil");

// Objek hasil terakhir untuk disimpan ke riwayat
let hasilTerakhir = null;

// ===== EVENT 1: Tombol "Proses Absensi" diklik =====
btnProses.addEventListener("click", function () {

  // ===== VARIABEL (lebih dari 4) dengan 3 TIPE DATA =====
  let nama         = inputNama.value.trim();        // String
  let nim          = inputNim.value.trim();          // String
  let status       = selectStatus.value;             // String
  let total        = Number(inputTotal.value);       // Number
  let hadir        = Number(inputHadir.value);       // Number
  let tugasSelesai = cekTugas.checked;               // Boolean

  hasilTerakhir = null;

  // ===== VALIDASI INPUT =====
  // OR : jika salah satu kolom wajib kosong → error
  if (nama === "" || nim === "" || status === "" ||
      inputTotal.value === "" || inputHadir.value === "") {
    tampilPesan("error", "⚠️ Semua kolom wajib diisi!");
    return;
  }

  // NOT : NIM harus angka (jika BUKAN angka → error), minimal 8 digit
  if (!/^[0-9]+$/.test(nim) || nim.length < 8) {
    tampilPesan("error", "⚠️ NIM harus berupa angka dan minimal 8 digit!");
    return;
  }

  // Perbandingan : total harus > 0, hadir tidak boleh negatif / melebihi total
  if (!Number.isInteger(total) || total <= 0) {
    tampilPesan("error", "⚠️ Total pertemuan harus bilangan bulat lebih dari 0!");
    return;
  }
  if (!Number.isInteger(hadir) || hadir < 0 || hadir > total) {
    tampilPesan("error", "⚠️ Jumlah hadir harus bilangan bulat dan tidak boleh lebih dari total pertemuan!");
    return;
  }

  // ===== OPERATOR ARITMATIKA =====
  let tidakHadir  = total - hadir;                  // pengurangan
  let persen      = (hadir / total) * 100;           // pembagian & perkalian
  let persenBulat = Math.round(persen * 10) / 10;   // pembulatan 1 desimal

  // ===== OPERATOR PERBANDINGAN + AND / OR / NOT =====
  // Syarat ikut ujian: kehadiran >= 75% DAN (AND) tugas sudah dikumpulkan
  let layakUjian = (persen >= 75) && tugasSelesai;

  // Keterangan status
  let keterangan;
  if (persen >= 75 && !tugasSelesai) {               // AND + NOT
    keterangan = "Kehadiran cukup, tetapi tugas belum dikumpulkan";
  } else if (persen < 75 || !tugasSelesai) {          // OR + NOT
    keterangan = "Belum memenuhi syarat ujian";
  } else {
    keterangan = "Memenuhi syarat ujian";
  }

  // Kategori kehadiran
  let kategori;
  if (persen >= 90)      kategori = "Sangat Baik";
  else if (persen >= 75) kategori = "Baik";
  else if (persen >= 50) kategori = "Kurang";
  else                   kategori = "Sangat Kurang";

  // Progress bar persentase
  let progressBar = '<div style="margin-top:10px;">' +
    '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">Persentase Kehadiran</div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + persenBulat + '%;"></div></div>' +
    '</div>';

  // ===== OUTPUT HASIL PADA FORM =====
  let jenis = layakUjian ? "sukses" : "peringatan";
  tampilPesan(jenis,
    "<b>Nama:</b> "               + nama       + "<br>" +
    "<b>NIM:</b> "                + nim        + "<br>" +
    "<b>Status hari ini:</b> "    + status     + "<br>" +
    "<b>Total pertemuan:</b> "    + total      + "<br>" +
    "<b>Hadir:</b> "              + hadir      +
    " | <b>Tidak hadir:</b> "     + tidakHadir + "<br>" +
    "<b>Persentase kehadiran:</b> " + persenBulat + "% (" + kategori + ")" +
    progressBar + "<br>" +
    "<b>Tugas:</b> " + (tugasSelesai ? "Sudah dikumpulkan ✅" : "Belum dikumpulkan ❌") + "<br>" +
    "<b>Keterangan:</b> "         + keterangan + "<br>" +
    "<b>Layak ikut ujian:</b> "   + (layakUjian ? "YA ✅" : "TIDAK ❌")
  );

  // Simpan data hasil terakhir dan langsung simpan ke localStorage
  hasilTerakhir = {
    nama, nim, status, total, hadir, tidakHadir,
    persen: persenBulat, kategori, tugasSelesai,
    layakUjian, keterangan,
    tanggal: new Date().toLocaleString('id-ID')
  };

  simpanData(hasilTerakhir);
  btnProses.disabled = true;   // cegah simpan ganda
});

// ===== EVENT 2: Tombol "Reset" diklik =====
btnReset.addEventListener("click", function () {
  inputNama.value      = "";
  inputNim.value       = "";
  selectStatus.value   = "";
  inputTotal.value     = "";
  inputHadir.value     = "";
  cekTugas.checked     = false;
  kotakHasil.className = "hasil";
  kotakHasil.innerHTML = "Hasil absensi akan tampil di sini.";
  hasilTerakhir        = null;
  btnProses.disabled   = false;   // aktifkan kembali tombol
});

// ===== EVENT 3 (bonus): NIM hanya angka saat mengetik =====
inputNim.addEventListener("input", function () {
  inputNim.value = inputNim.value.replace(/[^0-9]/g, "");
});

// ===== EVENT 4: Ubah isi form → tombol Proses aktif lagi =====
[inputNama, inputNim, selectStatus, inputTotal, inputHadir, cekTugas].forEach(function (el) {
  el.addEventListener("input", function () {
    btnProses.disabled = false;
  });
});

// ===== Fungsi bantu menampilkan pesan =====
function tampilPesan(jenis, isi) {
  kotakHasil.className = "hasil " + jenis;
  kotakHasil.innerHTML = isi;
}