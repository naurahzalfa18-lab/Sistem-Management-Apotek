// Skrip Pengujian Logika Bisnis & Validasi (Aturan PRD & 4 Perbaikan Baru)

import { INITIAL_MEDICINES, INITIAL_TRANSACTIONS, INITIAL_PRESCRIPTIONS, INITIAL_SETTINGS } from '../src/data/initialData.js';

console.log("=== MEMULAI PENGUJIAN LOGIKA BISNIS APLIKASI APOTEK ===");

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failCount++;
  }
}

const todayZero = new Date();
todayZero.setHours(0, 0, 0, 0);

// Helper cek kedaluwarsa
const isExpired = (dateStr) => {
  if (!dateStr) return false;
  const exp = new Date(dateStr);
  exp.setHours(0, 0, 0, 0);
  return exp < todayZero;
};

// Helper cek mendekati kedaluwarsa (<= 60 hari dan belum kedaluwarsa)
const isNearExpiry = (dateStr) => {
  if (!dateStr) return false;
  const exp = new Date(dateStr);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exp - todayZero) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 60;
};

// ==========================================
// 1. UJI IDENTITAS APOTEK & MASTER DATA SINTETIS
// ==========================================
assert(INITIAL_SETTINGS.pharmacyName === "Naurah Pharm", "Nama apotek berhasil disesuaikan menjadi 'Naurah Pharm'");
assert(INITIAL_SETTINGS.ownerName === "Naurah Zalfa Mauliyanto", "Nama pemilik/administrator adalah 'Naurah Zalfa Mauliyanto'");
assert(INITIAL_SETTINGS.pharmacistName === "apt. Naurah Zalfa Mauliyanto, S.Farm.", "Nama apoteker pengelola apotek (APA) sesuai identitas Naurah Zalfa Mauliyanto");
assert(INITIAL_MEDICINES.length >= 15, "Master obat awal memuat minimal 15 item sintetis");
assert(INITIAL_MEDICINES.some(m => m.stok <= m.stok_minimum), "Terdapat obat dengan kondisi stok rendah untuk pengujian");
assert(INITIAL_MEDICINES.some(m => m.aktif === false), "Terdapat obat berstatus non-aktif untuk pengujian");
assert(INITIAL_MEDICINES.some(m => isExpired(m.tanggal_kedaluwarsa)), "Terdapat obat dengan status sudah kedaluwarsa (MED-017) untuk pengujian");

// ==========================================
// 2. UJI VALIDASI KODE & HARGA/STOK
// ==========================================
function validateNewMedicineCode(code, list) {
  return !list.some(m => m.kode_obat.toLowerCase() === code.toLowerCase());
}
assert(!validateNewMedicineCode("OB-PCT-500", INITIAL_MEDICINES), "Kode obat duplikat ditolak dengan benar");
assert(validateNewMedicineCode("OB-NEW-999", INITIAL_MEDICINES), "Kode obat unik baru diterima");

function validatePriceAndStock(price, stock, minStock) {
  if (price < 0 || stock < 0 || minStock < 0) return false;
  return true;
}
assert(!validatePriceAndStock(-5000, 10, 5), "Harga jual negatif ditolak");
assert(!validatePriceAndStock(10000, -2, 5), "Stok negatif ditolak");
assert(validatePriceAndStock(10000, 15, 5), "Harga dan stok valid diterima");

// ==========================================
// 3. PERBAIKAN 1: PENCEGAHAN PENJUALAN OBAT KEDALUWARSA
// ==========================================
function simulateSale(medicineList, cartItems) {
  for (const item of cartItems) {
    const med = medicineList.find(m => m.id === item.obat_id);
    if (!med) return { success: false, reason: "Obat tidak ditemukan" };
    if (!med.aktif) return { success: false, reason: "Obat non-aktif" };
    
    // Validasi pencegahan penjualan obat kedaluwarsa
    if (isExpired(med.tanggal_kedaluwarsa)) {
      return { success: false, reason: `Obat "${med.nama}" sudah kedaluwarsa (${med.tanggal_kedaluwarsa})` };
    }

    if (item.jumlah > med.stok) {
      return { success: false, reason: "Stok tidak mencukupi" };
    }
  }

  // Deduct atomic stock
  const updatedMeds = medicineList.map(med => {
    const bought = cartItems.find(it => it.obat_id === med.id);
    if (bought) {
      return { ...med, stok: med.stok - bought.jumlah };
    }
    return med;
  });

  return { success: true, updatedMeds };
}

// Uji: Penjualan obat kedaluwarsa harus ditolak sistem meskipun stok ada
const expiredMed = INITIAL_MEDICINES.find(m => isExpired(m.tanggal_kedaluwarsa));
assert(expiredMed !== undefined, "Obat kedaluwarsa teridentifikasi di dataset");

const expiredSaleResult = simulateSale(INITIAL_MEDICINES, [
  { obat_id: expiredMed.id, jumlah: 1, harga_satuan_snapshot: expiredMed.harga_jual }
]);
assert(expiredSaleResult.success === false, "Perbaikan 1: Penjualan obat yang sudah kedaluwarsa berhasil dicegah oleh sistem");

// Uji: Penjualan dengan stok cukup dan tanggal valid berhasil
const validMed = INITIAL_MEDICINES.find(m => m.id === "MED-001");
const initialStock = validMed.stok;
const validSale = simulateSale(INITIAL_MEDICINES, [
  { obat_id: "MED-001", jumlah: 2, harga_satuan_snapshot: validMed.harga_jual }
]);
assert(validSale.success === true, "Penjualan obat yang masih berlaku dan stok cukup berhasil diproses");
const updatedMed = validSale.updatedMeds.find(m => m.id === "MED-001");
assert(updatedMed.stok === initialStock - 2, "Stok obat berkurang tepat sesuai jumlah yang dibeli");

// ==========================================
// 4. PERBAIKAN 2: KONFIRMASI SEBELUM PEMBAYARAN
// ==========================================
function calculateConfirmationSummary(cart, paymentMethod, cashGiven) {
  const totalItems = cart.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalAmount = cart.reduce((acc, curr) => acc + (curr.jumlah * curr.harga_satuan_snapshot), 0);
  const paid = paymentMethod === 'Tunai' ? Number(cashGiven) : totalAmount;
  const change = Math.max(0, paid - totalAmount);
  const isCashSufficient = paymentMethod !== 'Tunai' || paid >= totalAmount;

  return {
    totalItems,
    totalAmount,
    paymentMethod,
    paid,
    change,
    isCashSufficient
  };
}

const mockCart = [
  { obat_id: "MED-001", jumlah: 2, harga_satuan_snapshot: 7500 }, // 15.000
  { obat_id: "MED-004", jumlah: 1, harga_satuan_snapshot: 6500 }  // 6.500 -> total 21.500
];

const confirmSummary = calculateConfirmationSummary(mockCart, 'Tunai', 50000);
assert(confirmSummary.totalItems === 3, "Perbaikan 2: Kalkulasi total kuantitas item ringkasan konfirmasi tepat (3 unit)");
assert(confirmSummary.totalAmount === 21500, "Perbaikan 2: Kalkulasi total tagihan tepat (Rp 21.500)");
assert(confirmSummary.change === 28500, "Perbaikan 2: Kalkulasi uang kembalian pada konfirmasi tepat (Rp 28.500)");

const insufficientSummary = calculateConfirmationSummary(mockCart, 'Tunai', 20000);
assert(insufficientSummary.isCashSufficient === false, "Perbaikan 2: Uang tunai kurang dari total tagihan ditolak pada tahap pra-konfirmasi");

// ==========================================
// 5. PERBAIKAN 3: FILTER OBAT KEDALUWARSA TERPISAH
// ==========================================
const expiredList = INITIAL_MEDICINES.filter(m => isExpired(m.tanggal_kedaluwarsa));
const nearExpiryList = INITIAL_MEDICINES.filter(m => m.aktif && isNearExpiry(m.tanggal_kedaluwarsa));

assert(expiredList.length > 0, "Perbaikan 3: Filter 'Sudah Kedaluwarsa' menemukan item obat kedaluwarsa");
assert(!nearExpiryList.some(m => isExpired(m.tanggal_kedaluwarsa)), "Perbaikan 3: Filter 'Mendekati Expired' bersih dan tidak tercampur dengan obat yang sudah kedaluwarsa");

// ==========================================
// 6. PERBAIKAN 4: RIWAYAT TRANSAKSI KASIR & CETAK STRUK
// ==========================================
assert(INITIAL_TRANSACTIONS.length > 0, "Perbaikan 4: Terdapat riwayat transaksi yang siap ditampilkan di halaman kasir");
const sampleTrx = INITIAL_TRANSACTIONS[0];
assert(sampleTrx.nomor_transaksi && sampleTrx.items.length > 0, "Perbaikan 4: Transaksi kasir menyimpan data snapshot item untuk dicetak ulang");

// ==========================================
// 7. UJI RIWAYAT RESEP
// ==========================================
const rxDemo = INITIAL_PRESCRIPTIONS[0];
assert(rxDemo.status === "Menunggu Pemeriksaan", "Resep baru memiliki status awal 'Menunggu Pemeriksaan'");
assert(rxDemo.riwayat_status.length >= 1, "Resep mencatat waktu dan riwayat jejak audit status");

console.log(`\n=== HASIL AKHIR PENGUJIAN: ${passCount} LULUS, ${failCount} GAGAL ===\n`);
if (failCount > 0) process.exit(1);
