# KNOWLEDGE BASE

## Pengembangan Prototipe Aplikasi Apotek untuk Manajemen Obat, Transaksi Penjualan, dan Pencatatan Resep

**Versi:** 1.0\
**Tanggal:** 20 Oktober 2026\
**Tujuan dokumen:** Menjadi basis pengetahuan untuk AI di Antigravity
saat merancang dan membangun prototipe aplikasi apotek.

## 1. Gambaran proyek

Aplikasi ini adalah prototipe sistem informasi apotek berbahasa
Indonesia untuk membantu petugas mengelola data obat, mencatat transaksi
penjualan, dan mendokumentasikan resep. Antarmuka harus mudah dipahami,
rapi, ramah, dan menggunakan tema pink soft yang tetap memiliki kontras
serta keterbacaan baik.

Prototipe ini adalah alat bantu operasional dan demonstrasi. Prototipe
bukan pengganti penilaian profesional apoteker, bukan alat untuk
mendiagnosis penyakit, dan tidak boleh membuat rekomendasi dosis atau
terapi secara otomatis.

## 2. Riset aplikasi sejenis

Riset desk research dilakukan dengan membaca informasi fitur yang
dipublikasikan pada situs penyedia. Informasi di bawah merangkum klaim
fitur dari situs masing-masing, bukan hasil pengujian langsung terhadap
aplikasi berbayar.

### 2.1 Pharmatica

Situs: https://pharmatica.id/ Fitur yang dipublikasikan mencakup
manajemen stok, kasir, laporan, pengelolaan stok per cabang, pemantauan
kedaluwarsa, dan laporan usaha. Pelajaran untuk prototipe: - Ringkasan
dashboard perlu memperlihatkan kondisi stok dan penjualan. - Obat yang
stoknya rendah atau mendekati kedaluwarsa perlu mudah ditemukan. -
Laporan sebaiknya tersusun rapi dan bisa difilter berdasarkan periode.

### 2.2 Apotech ID

Situs: https://apotech.id/ Fitur yang dipublikasikan mencakup data
produk obat, stok, pembelian, penjualan, resep/racikan, laporan, dan
pengelolaan peran pengguna. Pelajaran untuk prototipe: - Modul obat,
transaksi, dan resep perlu menggunakan data yang konsisten. - Hak akses
adalah pertimbangan penting apabila prototipe dikembangkan menjadi
aplikasi nyata. - Resep harus memiliki status yang jelas sehingga
petugas mengetahui progresnya.

### 2.3 DHealthcare

Situs: https://www.dhealthcare.co.id/solusi/apotek Fitur yang
dipublikasikan mencakup penjualan resep dan nonresep, persediaan, batch
dan kedaluwarsa, pembelian/pemasok, serta laporan. Pelajaran untuk
prototipe: - Transaksi yang selesai harus memperbarui stok. - Informasi
batch dan tanggal kedaluwarsa penting untuk ketertelusuran. - Riwayat
transaksi harus dapat dilihat kembali.

### 2.4 Farmadigi

Situs: https://farmadigi.id/ Fitur yang dipublikasikan mencakup kasir,
pengelolaan stok dengan prinsip FEFO, resep racikan, laporan, dan fitur
operasional apotek lainnya. Pelajaran untuk prototipe: - Stok tidak
cukup hanya berupa satu angka; tanggal kedaluwarsa dan batch dapat
menjadi pengembangan penting. - Resep perlu melalui pemeriksaan petugas
yang berwenang. - Antarmuka kasir perlu dibuat ringkas agar proses input
tidak berbelit.

### 2.5 Ringkasan perbandingan

  -----------------------------------------------------------------------
  Area                    Pola umum dari riset    Keputusan untuk
                                                  prototipe
  ----------------------- ----------------------- -----------------------
  Stok obat               Data obat, jumlah stok, Wajib
                          peringatan stok         
                          rendah/kedaluwarsa      

  Penjualan               Pencarian obat,         Wajib
                          keranjang, total,       
                          pembayaran, riwayat     

  Resep                   Identitas               Wajib
                          pasien/dokter, daftar   
                          obat, status            

  Dashboard               Ringkasan dan           Wajib, sederhana
                          peringatan              

  Laporan                 Penjualan dan           Wajib, dasar
                          persediaan              

  Supplier/pembelian      Pembelian dan           Pengembangan berikutnya
                          penerimaan barang       

  Multi-cabang            Pemantauan beberapa     Di luar cakupan versi
                          lokasi                  pertama

  Integrasi eksternal     Sistem kesehatan,       Di luar cakupan versi
                          pembayaran, atau        pertama
                          layanan lain            

  Akuntansi lanjutan      Laba rugi, arus kas,    Di luar cakupan versi
                          utang-piutang           pertama
  -----------------------------------------------------------------------

## 3. Pengguna sasaran

1.  **Admin/petugas apotek:** mengelola data obat dan melihat stok.
2.  **Kasir:** membuat transaksi, menghitung total, mencatat pembayaran,
    dan melihat riwayat penjualan.
3.  **Apoteker/petugas berwenang:** mencatat dan meninjau informasi
    resep sesuai kewenangannya.
4.  **Pemilik/pengelola:** melihat ringkasan penjualan, persediaan, dan
    laporan.

Untuk prototipe kelas, peran dapat disimulasikan. Untuk penggunaan
nyata, autentikasi dan hak akses harus benar-benar ditegakkan pada sisi
server, bukan hanya dengan menyembunyikan menu.

## 4. Kebutuhan utama

### 4.1 Manajemen obat

Setiap data obat idealnya memiliki: - ID/kode obat yang unik - Nama
obat - Kategori atau jenis obat - Bentuk/satuan (misalnya tablet,
kapsul, botol) - Harga beli dan harga jual jika dibutuhkan - Jumlah
stok - Batas minimum stok - Nomor batch dan tanggal kedaluwarsa bila
data batch diterapkan - Status aktif/nonaktif

Fungsi: melihat daftar, mencari, memfilter kategori, menambah, mengedit,
dan menandai obat tidak aktif. Sistem harus mencegah stok negatif. Data
demo harus diberi label sebagai data contoh.

### 4.2 Transaksi penjualan

Alur yang diharapkan: 1. Petugas membuka halaman kasir. 2. Petugas
mencari dan memilih obat. 3. Petugas memasukkan jumlah. 4. Sistem
menampilkan harga satuan, subtotal, dan total. 5. Sistem memvalidasi
jumlah terhadap stok dan aturan penjualan yang dikonfigurasi. 6. Petugas
memilih metode pembayaran dan memasukkan nominal pembayaran jika
relevan. 7. Sistem menampilkan ringkasan untuk dikonfirmasi. 8. Setelah
transaksi dikonfirmasi berhasil, transaksi tersimpan dan stok berkurang.
9. Sistem menampilkan nomor transaksi dan struk yang dapat dicetak atau
dilihat kembali.

Simpan tanggal/waktu, nomor transaksi, item, jumlah, harga saat
transaksi, total, metode pembayaran, dan status. Pembatalan atau koreksi
harus tercatat; jangan menghapus transaksi diam-diam.

### 4.3 Pencatatan resep

Data resep yang dapat dicatat: - Nomor resep - Tanggal resep dan tanggal
penerimaan - Nama pasien atau identitas minimum yang diperlukan - Nama
dokter dan informasi praktik jika relevan - Daftar obat,
kekuatan/bentuk, jumlah, serta aturan pakai sebagaimana tertulis pada
resep - Catatan petugas - Status: Menunggu pemeriksaan, Diproses,
Selesai, atau Ditolak/Perlu klarifikasi - Petugas yang mencatat dan
waktu perubahan status

Aplikasi hanya mendokumentasikan data yang diberikan dan hasil
pemeriksaan petugas berwenang. Aplikasi tidak boleh menebak dosis,
mengganti obat, atau menyatakan resep valid secara otomatis. Hindari
penggunaan data pasien nyata dalam demo.

### 4.4 Dashboard dan laporan

Dashboard awal: - Total jenis obat aktif - Jumlah obat yang stoknya
rendah - Jumlah obat mendekati kedaluwarsa - Penjualan hari ini -
Transaksi terbaru

Laporan dasar: - Penjualan berdasarkan rentang tanggal - Detail
transaksi - Daftar stok obat - Daftar stok rendah dan obat mendekati
kedaluwarsa

Semua angka ringkasan harus berasal dari data aplikasi yang sama; jangan
menampilkan angka dekoratif yang tidak konsisten dengan tabel.

## 5. Prinsip desain dan pengalaman pengguna

-   Bahasa antarmuka: Bahasa Indonesia.
-   Gaya: lembut, ramah, modern, bersih, dan profesional.
-   Palet yang disarankan:
    -   Pink utama: `#D9799A`
    -   Pink aksen: `#C95C7A`
    -   Latar pink sangat muda: `#FFF7FA`
    -   Teks utama: `#0F172A`
    -   Latar kartu: `#FFFFFF`
    -   Peringatan: gunakan warna status yang berbeda dan tetap terbaca.
-   Gunakan sidebar sederhana di desktop dengan menu: Dashboard, Data
    Obat, Transaksi Penjualan, Resep, Laporan, Pengaturan.
-   Gunakan tombol dengan label tindakan yang jelas, formulir
    berkelompok, jarak antar elemen yang cukup, dan tabel yang dapat
    dicari.
-   Sediakan keadaan kosong, indikator memuat, validasi input,
    konfirmasi untuk tindakan penting, dan pesan sukses/gagal yang
    jelas.
-   Jangan mengandalkan warna saja untuk menunjukkan status; sertakan
    teks atau ikon yang bermakna.
-   Hindari terlalu banyak dekorasi, animasi, dan elemen yang mengganggu
    pekerjaan kasir.

## 6. Aturan bisnis penting

1.  Kode obat dan nomor transaksi harus unik.
2.  Jumlah penjualan harus berupa angka positif.
3.  Penjualan tidak boleh melebihi stok tersedia.
4.  Stok berkurang hanya setelah transaksi dinyatakan berhasil.
5.  Jika transaksi dibatalkan atau diretur, koreksi stok harus dilakukan
    secara terkontrol dan tercatat.
6.  Harga transaksi disimpan pada detail transaksi agar perubahan harga
    obat di masa depan tidak mengubah transaksi lama.
7.  Obat kedaluwarsa tidak boleh ditawarkan untuk penjualan dalam alur
    nyata; prototipe minimal harus memberi peringatan dan tidak boleh
    mengabaikan tanggal kedaluwarsa.
8.  Peringatan stok rendah muncul saat stok sama dengan atau di bawah
    batas minimum.
9.  Resep yang statusnya belum ditinjau tidak boleh dianggap sudah
    disetujui.
10. Catat jejak perubahan penting jika memungkinkan.
11. Jangan menggunakan data pasien nyata tanpa dasar, izin, dan
    pengamanan yang sesuai.
12. Untuk implementasi nyata, tinjau regulasi Indonesia yang berlaku
    bersama tenaga kefarmasian dan pihak yang kompeten sebelum
    digunakan.

## 7. Keamanan dan privasi

-   Gunakan data pasien dan resep sintetis untuk demo.
-   Batasi akses ke resep sesuai peran.
-   Jangan menampilkan kata sandi atau rahasia API di antarmuka maupun
    repositori.
-   Validasi input di sisi antarmuka dan server.
-   Simpan hanya data yang dibutuhkan.
-   Siapkan pencadangan dan pemulihan data jika aplikasi dikembangkan
    lebih lanjut.
-   Perlakukan data resep dan pasien sebagai informasi sensitif.

## 8. Batasan prototipe versi pertama

Termasuk: - Dashboard - CRUD data obat - Pencarian/filter obat -
Peringatan stok rendah dan kedaluwarsa - Kasir dan pencatatan
transaksi - Perubahan stok otomatis setelah transaksi berhasil - Form
pencatatan resep dan statusnya - Riwayat transaksi dan laporan dasar -
Desain responsif untuk desktop dan tablet

Tidak termasuk untuk versi pertama: - Diagnosis atau rekomendasi terapi
otomatis - Validasi klinis otomatis atas resep - Integrasi BPJS,
SATUSEHAT, SIPNAP, payment gateway, atau pemasok - Multi-cabang dan
sinkronisasi lintas cabang - Akuntansi penuh, penggajian, dan manajemen
utang-piutang - Penggunaan produksi dengan data pasien nyata

## 9. Referensi

1.  Pharmatica, https://pharmatica.id/
2.  Apotech ID, https://apotech.id/
3.  DHealthcare, https://www.dhealthcare.co.id/solusi/apotek
4.  Farmadigi, https://farmadigi.id/

Catatan: halaman produk dapat berubah. Riset ini adalah ringkasan desk
research berdasarkan informasi publik yang tersedia saat penyusunan
dokumen, bukan audit independen atau klaim bahwa semua fitur telah
diuji.
