# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Pengembangan Prototipe Aplikasi Apotek untuk Manajemen Obat, Transaksi Penjualan, dan Pencatatan Resep

**Versi:** 1.0\
**Tanggal:** 20 Oktober 2026\
**Status:** Acuan pengembangan prototipe\
**Platform target:** Aplikasi web responsif\
**Bahasa:** Indonesia

## 1. Ringkasan produk

Aplikasi web untuk membantu petugas apotek mengelola data obat, mencatat
transaksi penjualan, dan mendokumentasikan resep dalam satu antarmuka.
Desain menggunakan tema pink soft yang ramah, bersih, modern, mudah
dipahami, dan tetap profesional.

## 2. Latar belakang dan masalah

Pencatatan manual atau sistem yang terpisah dapat membuat pencarian data
lambat, stok tidak konsisten, tanggal kedaluwarsa terlewat, transaksi
sulit ditelusuri, dan catatan resep tersebar. Prototipe ini menguji alur
terintegrasi yang memusatkan data obat, transaksi, dan resep.

## 3. Tujuan

-   Mempermudah pengelolaan data obat dan stok.
-   Mempercepat pencatatan transaksi penjualan.
-   Membuat pencatatan resep lebih terstruktur dan mudah ditelusuri.
-   Memberikan ringkasan penjualan serta kondisi stok.
-   Menghasilkan prototipe yang konsisten, menarik, dan mudah digunakan.

### 3.1 Indikator keberhasilan

-   Pengguna dapat menemukan obat melalui pencarian.
-   Pengguna dapat menambah dan mengubah data obat dengan validasi.
-   Transaksi yang berhasil tercatat dan mengurangi stok dengan benar.
-   Transaksi dengan jumlah melebihi stok ditolak.
-   Resep dapat dicatat dan statusnya dapat diperbarui.
-   Dashboard dan laporan konsisten dengan data transaksi dan obat.
-   Tampilan utama dapat digunakan pada desktop dan tablet tanpa elemen
    terpotong.
-   Pesan kesalahan menjelaskan cara memperbaiki input.

## 4. Pengguna dan kebutuhan

### Admin/petugas apotek

Membutuhkan pengelolaan obat, stok, kategori, dan peringatan.

### Kasir

Membutuhkan pencarian obat cepat, keranjang transaksi, perhitungan
otomatis, pembayaran, dan riwayat.

### Apoteker/petugas berwenang

Membutuhkan pencatatan resep, daftar obat resep, catatan, dan status
pemeriksaan.

### Pemilik/pengelola

Membutuhkan ringkasan penjualan, kondisi persediaan, dan laporan
sederhana.

## 5. Ruang lingkup

### Termasuk versi pertama

1.  Dashboard
2.  Data obat (tambah, lihat, ubah, nonaktifkan)
3.  Pencarian dan filter obat
4.  Peringatan stok minimum dan kedaluwarsa
5.  Transaksi penjualan/kasir
6.  Riwayat transaksi dan detail transaksi
7.  Pencatatan resep dan status resep
8.  Laporan dasar penjualan dan stok
9.  Pengaturan profil apotek sederhana bila diperlukan
10. Data contoh untuk demonstrasi

### Tidak termasuk versi pertama

-   Diagnosis, pemilihan obat, atau rekomendasi dosis otomatis
-   Persetujuan resep otomatis
-   Integrasi BPJS, SATUSEHAT, SIPNAP, supplier, atau payment gateway
-   Multi-cabang, akuntansi penuh, dan penggajian
-   Produksi dengan data pasien nyata

## 6. Struktur navigasi

Menu utama: - Dashboard - Data Obat - Transaksi Penjualan - Pencatatan
Resep - Laporan - Pengaturan

Pada desktop, gunakan sidebar yang ringkas dan area konten utama. Pada
layar kecil, ubah navigasi menjadi menu yang tetap mudah ditemukan.
Jangan membuat terlalu banyak submenu.

## 7. Persyaratan fungsional

### FR-01 --- Dashboard

**Prioritas:** P0\
Sistem menampilkan kartu ringkasan: - Total jenis obat aktif - Obat
dengan stok rendah - Obat mendekati kedaluwarsa - Total penjualan hari
ini - Transaksi terbaru

**Kriteria penerimaan:** - Nilai ringkasan dihitung dari data aplikasi,
bukan angka statis. - Klik kartu peringatan membuka daftar yang sesuai
jika memungkinkan. - Jika belum ada data, tampilkan nilai nol dan
petunjuk yang ramah.

### FR-02 --- Daftar obat

**Prioritas:** P0\
Tabel menampilkan kode, nama obat, kategori, satuan, stok, harga jual,
tanggal kedaluwarsa (jika tersedia), dan status.

**Kriteria penerimaan:** - Pengguna dapat mencari berdasarkan kode atau
nama. - Pengguna dapat memfilter kategori dan kondisi stok. - Tabel
menampilkan keadaan kosong jika belum ada obat. - Status stok rendah dan
kedaluwarsa ditampilkan dengan label teks yang jelas.

### FR-03 --- Tambah dan edit obat

**Prioritas:** P0\
Form minimal: kode obat, nama obat, kategori, satuan, harga beli
(opsional untuk demo), harga jual, stok, batas minimum stok, dan tanggal
kedaluwarsa jika berlaku.

**Kriteria penerimaan:** - Kolom wajib divalidasi. - Kode obat tidak
boleh duplikat. - Harga dan stok tidak boleh negatif. - Setelah
disimpan, data langsung terlihat pada daftar dan dashboard. - Pengguna
mendapat notifikasi berhasil atau pesan kesalahan yang spesifik.

### FR-04 --- Transaksi penjualan

**Prioritas:** P0\
Kasir dapat mencari obat, menambahkan item ke keranjang, mengubah
jumlah, menghapus item sebelum pembayaran, memilih metode pembayaran,
dan melihat subtotal serta total.

**Kriteria penerimaan:** - Total dihitung otomatis dari jumlah dikalikan
harga jual. - Sistem menolak jumlah nol/negatif. - Sistem menolak jumlah
yang melebihi stok. - Tombol "Proses Pembayaran" menampilkan ringkasan
untuk konfirmasi. - Setelah berhasil, sistem membuat nomor transaksi
unik dan mengurangi stok tepat satu kali. - Detail transaksi menyimpan
harga saat transaksi. - Struk atau tampilan bukti transaksi memuat
nomor, tanggal/waktu, item, jumlah, harga, total, dan metode
pembayaran. - Jika proses gagal, stok tidak berubah dan pengguna diberi
pesan yang jelas.

### FR-05 --- Riwayat transaksi

**Prioritas:** P0\
Pengguna dapat melihat daftar transaksi, mencari nomor transaksi,
memfilter tanggal, dan membuka detail.

**Kriteria penerimaan:** - Riwayat menampilkan nomor transaksi, waktu,
total, metode pembayaran, dan status. - Detail transaksi sesuai dengan
data saat transaksi dibuat. - Transaksi lama tidak berubah jika harga
obat diperbarui.

### FR-06 --- Pencatatan resep

**Prioritas:** P0\
Form resep memuat nomor resep, tanggal, identitas pasien minimum yang
diperlukan, nama dokter, item obat sebagaimana tertulis pada resep,
aturan pakai yang dicatat dari sumber resep, catatan, dan status.

**Kriteria penerimaan:** - Nomor resep unik. - Data resep dapat
disimpan, dibuka kembali, dan dicari. - Status yang tersedia: Menunggu
pemeriksaan, Diproses, Selesai, Perlu klarifikasi/Ditolak. - Status dan
waktu pembaruannya terlihat. - Sistem tidak membuat diagnosis, dosis,
atau penggantian obat otomatis. - Data pasien demo harus sintetis.

### FR-07 --- Laporan dasar

**Prioritas:** P1\
Menampilkan ringkasan penjualan berdasarkan rentang tanggal, daftar
transaksi, daftar stok, stok rendah, dan obat mendekati kedaluwarsa.

**Kriteria penerimaan:** - Filter tanggal memengaruhi hasil. - Total
laporan sama dengan transaksi yang masuk dalam rentang tersebut. -
Pengguna dapat membaca laporan tanpa harus membuka setiap transaksi. -
Ekspor PDF/Excel dapat ditambahkan jika waktu pengembangan memungkinkan;
bukan syarat inti prototipe.

### FR-08 --- Tampilan dan validasi

**Prioritas:** P0\
Semua halaman menggunakan bahasa Indonesia, pola tombol yang konsisten,
label input jelas, dan pesan status yang mudah dimengerti.

**Kriteria penerimaan:** - Tombol utama menggunakan kata kerja jelas,
misalnya "Simpan Obat", "Tambah ke Keranjang", dan "Proses
Pembayaran". - Aksi berisiko memerlukan konfirmasi. - Ada indikator
memuat, keadaan kosong, dan pesan error. - Kontras teks dan latar cukup;
status tidak dibedakan hanya berdasarkan warna. - Tata letak responsif
pada desktop dan tablet.

## 8. Alur pengguna utama

### 8.1 Menambah obat

Dashboard → Data Obat → Tambah Obat → Isi form → Validasi → Simpan →
Daftar obat diperbarui.

### 8.2 Melakukan penjualan

Transaksi Penjualan → Cari obat → Tambah ke keranjang → Atur jumlah →
Periksa total → Pilih pembayaran → Konfirmasi → Transaksi tersimpan →
Stok diperbarui → Bukti transaksi ditampilkan.

### 8.3 Mencatat resep

Pencatatan Resep → Tambah Resep → Isi informasi dari resep → Simpan
dengan status awal → Petugas berwenang meninjau → Perbarui status sesuai
proses nyata.

## 9. Aturan bisnis dan validasi

-   ID obat, nomor transaksi, dan nomor resep harus unik.
-   Harga dan jumlah tidak boleh negatif.
-   Penjualan harus memeriksa stok terbaru sebelum disimpan.
-   Stok berkurang hanya ketika transaksi berhasil dikonfirmasi.
-   Pembatalan, retur, dan penyesuaian stok harus tercatat; jangan
    mengubah riwayat tanpa jejak.
-   Harga yang tercatat di transaksi menjadi snapshot harga saat
    penjualan.
-   Obat kedaluwarsa harus diberi peringatan dan tidak boleh dijual
    dalam alur nyata.
-   Resep yang belum ditinjau tidak boleh dianggap telah disetujui.
-   Semua nilai dashboard dan laporan harus bersumber dari data yang
    sama.

## 10. Rancangan visual

### Palet warna

-   Warna utama: `#D9799A`
-   Aksen: `#C95C7A`
-   Latar utama: `#FFF7FA`
-   Teks utama: `#0F172A`
-   Kartu: `#FFFFFF`
-   Border lembut: `#F1DCE4`

### Gaya komponen

-   Kartu dengan sudut membulat secukupnya dan bayangan ringan.
-   Tombol utama pink dengan teks yang kontras.
-   Tombol sekunder berwarna netral.
-   Ikon sederhana dan konsisten.
-   Tabel bersih dengan ruang yang cukup.
-   Badge status yang menyertakan teks.
-   Form tidak terlalu padat dan memiliki label tetap, bukan hanya
    placeholder.
-   Hindari dekorasi berlebihan agar aplikasi tetap profesional untuk
    lingkungan apotek.

### Nada antarmuka

Gunakan bahasa ramah dan langsung: - "Obat berhasil disimpan." - "Stok
tidak mencukupi. Periksa jumlah obat." - "Resep berhasil dicatat." -
"Belum ada transaksi pada periode ini."

## 11. Model data konseptual

### Obat

`id`, `kode_obat`, `nama`, `kategori`, `satuan`, `harga_beli`,
`harga_jual`, `stok`, `stok_minimum`, `tanggal_kedaluwarsa` (atau data
batch), `aktif`.

### Transaksi

`id`, `nomor_transaksi`, `tanggal_waktu`, `item_transaksi`, `subtotal`,
`total`, `metode_pembayaran`, `status`, `petugas`.

### Item transaksi

`id`, `transaksi_id`, `obat_id`, `nama_obat_snapshot`, `jumlah`,
`harga_satuan_snapshot`, `subtotal`.

### Resep

`id`, `nomor_resep`, `tanggal_resep`, `tanggal_diterima`,
`identitas_pasien_minimum`, `nama_dokter`, `daftar_item_resep`,
`catatan`, `status`, `dicatat_oleh`, `waktu_pembaruan`.

### Riwayat perubahan

Untuk pengembangan lebih lanjut: `id`, `pengguna`, `aksi`, `jenis_data`,
`id_data`, `waktu`, `nilai_sebelum`, `nilai_sesudah`.

Model data final mengikuti teknologi yang dipilih di Antigravity. Jangan
menyimpan semua data resep sebagai teks tunggal jika aplikasi
membutuhkan pencarian per item; struktur relasional lebih sesuai.

## 12. Persyaratan nonfungsional

-   Mudah dipelajari oleh pengguna baru.
-   Responsif untuk ukuran layar desktop dan tablet.
-   Validasi dilakukan sebelum data disimpan.
-   Data transaksi tidak boleh terduplikasi akibat klik berulang.
-   Data sensitif tidak ditampilkan kepada pengguna yang tidak
    berwenang.
-   Kesalahan harus disampaikan tanpa istilah teknis yang membingungkan.
-   Kode dipisah berdasarkan tanggung jawab dan mudah dirawat.
-   Gunakan data sintetis untuk demonstrasi.
-   Jika memakai backend, otorisasi dan validasi harus diterapkan di
    server.

## 13. Keamanan, privasi, dan batasan medis

-   Jangan masukkan data pasien nyata ke prototipe.
-   Jangan menambahkan fitur diagnosis atau saran dosis otomatis.
-   Catat resep berdasarkan informasi sumber; keputusan farmasi
    dilakukan oleh tenaga berwenang.
-   Lindungi akses terhadap data resep.
-   Jangan simpan rahasia/API key di kode frontend.
-   Sebelum penggunaan nyata, lakukan tinjauan keamanan, privasi,
    regulasi, dan alur kerja bersama tenaga kefarmasian yang kompeten.

## 14. Rencana pengembangan bertahap

### Tahap 1 --- Kerangka dan desain

Buat navigasi, tema warna, dashboard, layout responsif, dan data demo.

### Tahap 2 --- Data obat

Bangun daftar, pencarian, filter, tambah/edit, validasi, dan peringatan
stok.

### Tahap 3 --- Kasir

Bangun keranjang, kalkulasi, validasi stok, pembayaran simulasi, nomor
transaksi, struk, dan riwayat.

### Tahap 4 --- Resep

Bangun form resep, daftar, detail, pencarian, dan status.

### Tahap 5 --- Laporan dan pengujian

Bangun filter tanggal, laporan dasar, dan uji semua alur.

## 15. Skenario pengujian minimum

1.  Menambah obat dengan data valid berhasil.
2.  Kode obat duplikat ditolak.
3.  Harga negatif ditolak.
4.  Pencarian menemukan obat berdasarkan nama/kode.
5.  Penjualan dengan stok cukup berhasil dan stok berkurang sesuai
    jumlah.
6.  Penjualan melebihi stok ditolak dan stok tidak berubah.
7.  Klik proses pembayaran berulang tidak membuat transaksi ganda.
8.  Harga transaksi lama tetap sama setelah harga master diubah.
9.  Resep tersimpan dan statusnya dapat diperbarui.
10. Resep demo tidak dianggap otomatis valid.
11. Dashboard berubah setelah obat/transaksi berubah.
12. Filter tanggal laporan memberikan total yang sesuai.
13. Data kosong menampilkan petunjuk yang jelas.
14. Tata letak tetap dapat dipakai pada layar lebih kecil.

## 16. Instruksi untuk AI Antigravity

Gunakan dokumen ini sebagai acuan utama selama pengembangan. Sebelum
menulis kode, buat rencana implementasi singkat dan periksa struktur
proyek yang sudah ada. Jangan menghapus atau menimpa file yang sudah ada
tanpa alasan. Implementasikan fitur secara bertahap dan pastikan setiap
alur berfungsi, bukan hanya tampilan statis.

Prioritaskan: 1. Konsistensi data obat, transaksi, stok, dan resep. 2.
Validasi dan penanganan kondisi gagal. 3. Antarmuka Bahasa Indonesia
dengan tema pink soft. 4. Keterbacaan, kemudahan penggunaan, dan
responsivitas. 5. Data demo sintetis dan penjelasan yang jujur mengenai
fitur simulasi.

Jika ada keputusan teknis yang belum ditentukan, pilih pendekatan
sederhana yang sesuai dengan struktur proyek dan jelaskan asumsi sebelum
membuat perubahan besar. Jangan mengklaim integrasi atau keamanan yang
belum benar-benar diimplementasikan.
