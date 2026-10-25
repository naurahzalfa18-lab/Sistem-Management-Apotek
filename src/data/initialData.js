// Data Sintetis Awal untuk Demonstrasi Prototipe Apotek Sehat Harmoni
// Sesuai panduan PRD: data realistis, aman, dan mempermudah pengujian seluruh skenario

export const INITIAL_SETTINGS = {
  pharmacyName: "Apotek Sehat Harmoni",
  slogan: "Sahabat Sehat Keluarga Anda",
  address: "Jl. Boulevard Medika No. 12, Kebayoran Baru, Jakarta Selatan",
  phone: "021-78901234 / 0812-9876-5432",
  siaNumber: "SIA: 503/042/SIA/DPMPTSP/2023",
  sipaNumber: "SIPA: 19920814/SIPA_31.74/2022/2045",
  pharmacistName: "apt. Melati Kusuma Dewi, S.Farm.",
  receiptFooter: "Semoga Lekas Sembuh. Simpan obat di tempat sejuk & jauhkan dari jangkauan anak-anak.",
};

export const INITIAL_MEDICINES = [
  {
    id: "MED-001",
    kode_obat: "OB-PCT-500",
    nama: "Paracetamol 500mg Tablet",
    kategori: "Obat Bebas",
    satuan: "Strip (10 Tab)",
    harga_beli: 4500,
    harga_jual: 7500,
    stok: 65,
    stok_minimum: 15,
    tanggal_kedaluwarsa: "2027-08-15",
    nomor_batch: "BTC-PCT-2401",
    aktif: true,
    deskripsi: "Pereda nyeri dan demam ringan hingga sedang."
  },
  {
    id: "MED-002",
    kode_obat: "OK-AMX-500",
    nama: "Amoxicillin 500mg Kaplet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Kap)",
    harga_beli: 8000,
    harga_jual: 13500,
    stok: 8, // STOK RENDAH (< 15) untuk demonstrasi
    stok_minimum: 15,
    tanggal_kedaluwarsa: "2027-04-10",
    nomor_batch: "BTC-AMX-2309",
    aktif: true,
    deskripsi: "Antibiotik spektrum luas golongan penisilin (Harus dengan resep dokter)."
  },
  {
    id: "MED-003",
    kode_obat: "OBT-CTZ-10",
    nama: "Cetirizine 10mg Tablet",
    kategori: "Obat Bebas Terbatas",
    satuan: "Strip (10 Tab)",
    harga_beli: 5500,
    harga_jual: 9000,
    stok: 32,
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2026-11-28", // MENDEKATI KEDALUWARSA (< 60 hari) untuk demonstrasi
    nomor_batch: "BTC-CTZ-2211",
    aktif: true,
    deskripsi: "Antihistamin pereda gejala alergi dan gatal-gatal."
  },
  {
    id: "MED-004",
    kode_obat: "OB-ANT-CHW",
    nama: "Antasida DOEN Kunyah",
    kategori: "Obat Bebas",
    satuan: "Strip (10 Tab)",
    harga_beli: 4000,
    harga_jual: 6500,
    stok: 48,
    stok_minimum: 12,
    tanggal_kedaluwarsa: "2027-10-30",
    nomor_batch: "BTC-ANT-2405",
    aktif: true,
    deskripsi: "Mengurangi gejala kelebihan asam lambung dan maag."
  },
  {
    id: "MED-005",
    kode_obat: "OK-SBT-002",
    nama: "Salbutamol 2mg Tablet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Tab)",
    harga_beli: 6000,
    harga_jual: 11000,
    stok: 4, // STOK KRITIS (< 10)
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2027-02-14",
    nomor_batch: "BTC-SBT-2304",
    aktif: true,
    deskripsi: "Bronkodilator untuk meredakan sesak nafas dan asma."
  },
  {
    id: "MED-006",
    kode_obat: "SUP-VIT-500",
    nama: "Vitamin C 500mg Non-Acidic",
    kategori: "Suplemen & Vitamin",
    satuan: "Botol (30 Kap)",
    harga_beli: 38000,
    harga_jual: 55000,
    stok: 24,
    stok_minimum: 8,
    tanggal_kedaluwarsa: "2027-12-20",
    nomor_batch: "BTC-VTC-2408",
    aktif: true,
    deskripsi: "Suplemen penjaga daya tahan tubuh aman untuk lambung."
  },
  {
    id: "MED-007",
    kode_obat: "OBT-OBH-100",
    nama: "OBH Sirup Batuk Berdahak 100ml",
    kategori: "Obat Bebas Terbatas",
    satuan: "Botol (100ml)",
    harga_beli: 15000,
    harga_jual: 22000,
    stok: 19,
    stok_minimum: 6,
    tanggal_kedaluwarsa: "2026-12-05", // MENDEKATI KEDALUWARSA (< 60 hari)
    nomor_batch: "BTC-OBH-2312",
    aktif: true,
    deskripsi: "Sirup pereda batuk berdahak dan melegakan tenggorokan."
  },
  {
    id: "MED-008",
    kode_obat: "OK-MEF-500",
    nama: "Asam Mefenamat 500mg Kaplet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Kap)",
    harga_beli: 7000,
    harga_jual: 12000,
    stok: 35,
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2027-06-18",
    nomor_batch: "BTC-MEF-2402",
    aktif: true,
    deskripsi: "Antiinflamasi pereda nyeri gigi, sakit kepala berat, atau dismenore."
  },
  {
    id: "MED-009",
    kode_obat: "OK-AML-010",
    nama: "Amlodipine 10mg Tablet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Tab)",
    harga_beli: 9000,
    harga_jual: 15000,
    stok: 40,
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2027-09-01",
    nomor_batch: "BTC-AML-2403",
    aktif: true,
    deskripsi: "Obat pengendali tekanan darah tinggi (Hipertensi)."
  },
  {
    id: "MED-010",
    kode_obat: "OK-MET-500",
    nama: "Metformin HCl 500mg Tablet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Tab)",
    harga_beli: 6500,
    harga_jual: 11500,
    stok: 50,
    stok_minimum: 12,
    tanggal_kedaluwarsa: "2027-11-15",
    nomor_batch: "BTC-MET-2404",
    aktif: true,
    deskripsi: "Antidiabetes oral untuk pasien diabetes melitus tipe 2."
  },
  {
    id: "MED-011",
    kode_obat: "SUP-NRB-FRT",
    nama: "Neurobion Forte Tablet",
    kategori: "Suplemen & Vitamin",
    satuan: "Strip (10 Tab)",
    harga_beli: 36000,
    harga_jual: 46000,
    stok: 15,
    stok_minimum: 5,
    tanggal_kedaluwarsa: "2027-07-22",
    nomor_batch: "BTC-NRB-2406",
    aktif: true,
    deskripsi: "Kombinasi vitamin neurotropik B1, B6, B12 untuk kebas dan kesemutan."
  },
  {
    id: "MED-012",
    kode_obat: "ALK-MSK-3PL",
    nama: "Masker Medis 3-Ply BFE 99%",
    kategori: "Alat Kesehatan",
    satuan: "Kotak (50 Pcs)",
    harga_beli: 25000,
    harga_jual: 38000,
    stok: 30,
    stok_minimum: 8,
    tanggal_kedaluwarsa: "2029-01-01",
    nomor_batch: "BTC-MSK-2407",
    aktif: true,
    deskripsi: "Masker pelindung saluran pernapasan higienis sekali pakai."
  },
  {
    id: "MED-013",
    kode_obat: "ALK-ALC-70P",
    nama: "Alkohol 70% Antiseptik 100ml",
    kategori: "Alat Kesehatan",
    satuan: "Botol (100ml)",
    harga_beli: 7500,
    harga_jual: 12500,
    stok: 22,
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2028-05-15",
    nomor_batch: "BTC-ALC-2401",
    aktif: true,
    deskripsi: "Cairan antiseptik dan pembersih luka luar."
  },
  {
    id: "MED-014",
    kode_obat: "OB-PAN-EXT",
    nama: "Panadol Extra Merah",
    kategori: "Obat Bebas",
    satuan: "Blister (10 Kap)",
    harga_beli: 11000,
    harga_jual: 16500,
    stok: 28,
    stok_minimum: 8,
    tanggal_kedaluwarsa: "2027-05-10",
    nomor_batch: "BTC-PAN-2409",
    aktif: true,
    deskripsi: "Paracetamol & Cafein pereda sakit kepala dan sakit gigi membandel."
  },
  {
    id: "MED-015",
    kode_obat: "OB-MKP-060",
    nama: "Minyak Kayu Putih Cap Lang 60ml",
    kategori: "Obat Bebas",
    satuan: "Botol (60ml)",
    harga_beli: 18000,
    harga_jual: 24500,
    stok: 5, // STOK RENDAH (< 8)
    stok_minimum: 8,
    tanggal_kedaluwarsa: "2028-10-12",
    nomor_batch: "BTC-MKP-2311",
    aktif: true,
    deskripsi: "Minyak kayu putih alami penghangat tubuh dan pereda masuk angin."
  },
  {
    id: "MED-016",
    kode_obat: "OK-DXM-005",
    nama: "Dexamethasone 0.5mg Tablet",
    kategori: "Obat Keras",
    satuan: "Strip (10 Tab)",
    harga_beli: 3000,
    harga_jual: 5500,
    stok: 0, // STOK HABIS (0)
    stok_minimum: 10,
    tanggal_kedaluwarsa: "2026-10-31", // Kedaluwarsa segera
    nomor_batch: "BTC-DXM-2210",
    aktif: false, // Dinonaktifkan sementara
    deskripsi: "Kortikosteroid anti-inflamasi kuat (Status non-aktif sementara)."
  },
  {
    id: "MED-017",
    kode_obat: "OB-BET-015",
    nama: "Betadine Antiseptic Solution 15ml",
    kategori: "Obat Bebas Terbatas",
    satuan: "Botol (15ml)",
    harga_beli: 12000,
    harga_jual: 18500,
    stok: 12,
    stok_minimum: 5,
    tanggal_kedaluwarsa: "2026-08-20", // SUDAH KEDALUWARSA untuk pengujian
    nomor_batch: "BTC-BET-2208",
    aktif: true,
    deskripsi: "Cairan antiseptik povidone iodine untuk luka luar (Sudah lewat tanggal kedaluwarsa)."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TRX-20261020-0001",
    nomor_transaksi: "TRX-20261020-0001",
    tanggal_waktu: "2026-10-20T08:35:00",
    items: [
      {
        obat_id: "MED-001",
        kode_obat: "OB-PCT-500",
        nama_obat_snapshot: "Paracetamol 500mg Tablet",
        jumlah: 2,
        harga_satuan_snapshot: 7500,
        subtotal: 15000
      },
      {
        obat_id: "MED-006",
        kode_obat: "SUP-VIT-500",
        nama_obat_snapshot: "Vitamin C 500mg Non-Acidic",
        jumlah: 1,
        harga_satuan_snapshot: 55000,
        subtotal: 55000
      }
    ],
    subtotal: 70000,
    diskon: 0,
    total: 70000,
    metode_pembayaran: "QRIS",
    nominal_bayar: 70000,
    kembalian: 0,
    petugas: "Siti Rahmawati (Kasir Shift Pagi)",
    status: "Selesai",
    catatan: "Pelanggan reguler"
  },
  {
    id: "TRX-20261020-0002",
    nomor_transaksi: "TRX-20261020-0002",
    tanggal_waktu: "2026-10-20T09:15:20",
    items: [
      {
        obat_id: "MED-007",
        kode_obat: "OBT-OBH-100",
        nama_obat_snapshot: "OBH Sirup Batuk Berdahak 100ml",
        jumlah: 1,
        harga_satuan_snapshot: 22000,
        subtotal: 22000
      },
      {
        obat_id: "MED-014",
        kode_obat: "OB-PAN-EXT",
        nama_obat_snapshot: "Panadol Extra Merah",
        jumlah: 1,
        harga_satuan_snapshot: 16500,
        subtotal: 16500
      }
    ],
    subtotal: 38500,
    diskon: 0,
    total: 38500,
    metode_pembayaran: "Tunai",
    nominal_bayar: 50000,
    kembalian: 11500,
    petugas: "Siti Rahmawati (Kasir Shift Pagi)",
    status: "Selesai",
    catatan: "-"
  },
  {
    id: "TRX-20261019-0045",
    nomor_transaksi: "TRX-20261019-0045",
    tanggal_waktu: "2026-10-19T16:40:11",
    items: [
      {
        obat_id: "MED-009",
        kode_obat: "OK-AML-010",
        nama_obat_snapshot: "Amlodipine 10mg Tablet",
        jumlah: 3,
        harga_satuan_snapshot: 15000,
        subtotal: 45000
      },
      {
        obat_id: "MED-010",
        kode_obat: "OK-MET-500",
        nama_obat_snapshot: "Metformin HCl 500mg Tablet",
        jumlah: 3,
        harga_satuan_snapshot: 11500,
        subtotal: 34500
      }
    ],
    subtotal: 79500,
    diskon: 0,
    total: 79500,
    metode_pembayaran: "Kartu Debit",
    nominal_bayar: 79500,
    kembalian: 0,
    petugas: "Andi Saputra (Kasir Shift Sore)",
    status: "Selesai",
    catatan: "Penebusan obat rutin"
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "RXP-20261020-0001",
    nomor_resep: "RXP-20261020-0001",
    tanggal_resep: "2026-10-20",
    tanggal_diterima: "2026-10-20T08:50:00",
    pasien: {
      nama: "Tn. Bambang Sutrisno",
      usia: "54 Tahun",
      gender: "Laki-laki",
      no_telepon: "0813-8822-1199",
      alamat: "Tebet Barat Dalam No. 4, Jakarta Selatan"
    },
    dokter: {
      nama: "dr. Hendra Pratama, Sp.PD",
      sip: "SIP: 446/SIP/DISKES/2021",
      klinik_rs: "RS Medika Utama Jakarta"
    },
    items: [
      {
        id: "RX-ITM-1",
        nama_obat: "Amlodipine 10mg",
        jumlah: "30 Tablet",
        aturan_pakai: "1 x 1 tablet tiap pagi sesudah makan",
        keterangan: "Pengendali hipertensi"
      },
      {
        id: "RX-ITM-2",
        nama_obat: "Metformin 500mg",
        jumlah: "60 Tablet",
        aturan_pakai: "2 x 1 tablet bersama suapan pertama makan",
        keterangan: "Kontrol gula darah"
      }
    ],
    status: "Menunggu Pemeriksaan", // Status awal
    catatan_apoteker: "Pasien membawa resep asli fisik. Perlu skrining interaksi obat.",
    dicatat_oleh: "Siti Rahmawati",
    riwayat_status: [
      {
        status: "Menunggu Pemeriksaan",
        waktu: "2026-10-20T08:50:00",
        petugas: "Siti Rahmawati",
        catatan: "Resep diterima dari pasien di loket penerimaan."
      }
    ]
  },
  {
    id: "RXP-20261020-0002",
    nomor_resep: "RXP-20261020-0002",
    tanggal_resep: "2026-10-20",
    tanggal_diterima: "2026-10-20T09:20:00",
    pasien: {
      nama: "Ny. Ratna Dewi",
      usia: "29 Tahun",
      gender: "Perempuan",
      no_telepon: "0856-7733-4411",
      alamat: "Jl. Mampang Prapatan V No. 18"
    },
    dokter: {
      nama: "dr. Amanda Clarissa, Sp.A",
      sip: "SIP: 312/SIP/DISKES/2022",
      klinik_rs: "Klinik Ibu & Anak Permata"
    },
    items: [
      {
        id: "RX-ITM-3",
        nama_obat: "Amoxicillin Sirup Kering 125mg/5ml",
        jumlah: "1 Botol (60ml)",
        aturan_pakai: "3 x 1 sendok takar (5ml) tiap 8 jam dihabiskan",
        keterangan: "Untuk An. Kevin (3 tahun)"
      },
      {
        id: "RX-ITM-4",
        nama_obat: "Paracetamol Drop 100mg/ml",
        jumlah: "1 Botol (15ml)",
        aturan_pakai: "3-4 x 0.8 ml jika demam di atas 38C",
        keterangan: "Bila perlu / prn"
      }
    ],
    status: "Diproses",
    catatan_apoteker: "Sedang proses pelarutan antibiotik kering dan pemberian etiket.",
    dicatat_oleh: "apt. Melati Kusuma Dewi, S.Farm.",
    riwayat_status: [
      {
        status: "Menunggu Pemeriksaan",
        waktu: "2026-10-20T09:20:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Resep diverifikasi legalitas & kelengkapannya."
      },
      {
        status: "Diproses",
        waktu: "2026-10-20T09:28:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Resep disetujui, sedang diracik dan disiapkan etiket pemakaian."
      }
    ]
  },
  {
    id: "RXP-20261019-0012",
    nomor_resep: "RXP-20261019-0012",
    tanggal_resep: "2026-10-19",
    tanggal_diterima: "2026-10-19T14:10:00",
    pasien: {
      nama: "Tn. Agus Kurniawan",
      usia: "42 Tahun",
      gender: "Laki-laki",
      no_telepon: "0812-3344-5566",
      alamat: "Pancoran Indah Blok C3"
    },
    dokter: {
      nama: "dr. Budi Santoso, Sp.P",
      sip: "SIP: 118/SIP/DISKES/2019",
      klinik_rs: "RS Paru Sehat"
    },
    items: [
      {
        id: "RX-ITM-5",
        nama_obat: "Salbutamol 2mg Tablet",
        jumlah: "20 Tablet",
        aturan_pakai: "3 x 1 tablet bila sesak nafas",
        keterangan: "Obat asma"
      },
      {
        id: "RX-ITM-6",
        nama_obat: "Cetirizine 10mg",
        jumlah: "10 Tablet",
        aturan_pakai: "1 x 1 tablet malam hari sebelum tidur",
        keterangan: "Pencegahan alergi dingin"
      }
    ],
    status: "Selesai",
    catatan_apoteker: "Obat telah diserahkan beserta edukasi KIE (Komunikasi, Informasi, Edukasi) cara pemakaian.",
    dicatat_oleh: "apt. Melati Kusuma Dewi, S.Farm.",
    riwayat_status: [
      {
        status: "Menunggu Pemeriksaan",
        waktu: "2026-10-19T14:10:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Resep masuk."
      },
      {
        status: "Diproses",
        waktu: "2026-10-19T14:15:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Obat diambil dan dicek nomor batch."
      },
      {
        status: "Selesai",
        waktu: "2026-10-19T14:25:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Penyerahan obat ke pasien selesai."
      }
    ]
  },
  {
    id: "RXP-20261019-0010",
    nomor_resep: "RXP-20261019-0010",
    tanggal_resep: "2026-10-19",
    tanggal_diterima: "2026-10-19T11:05:00",
    pasien: {
      nama: "Ny. Mega Utami",
      usia: "36 Tahun",
      gender: "Perempuan",
      no_telepon: "0878-1122-3344",
      alamat: "Kalibata City Tower Kemuning"
    },
    dokter: {
      nama: "dr. Rian Firmansyah",
      sip: "SIP: 992/SIP/DISKES/2023",
      klinik_rs: "Klinik Pratama Sehat Bersama"
    },
    items: [
      {
        id: "RX-ITM-7",
        nama_obat: "Amoxicillin 500mg Kaplet",
        jumlah: "15 Kaplet",
        aturan_pakai: "3 x 1 kaplet tiap 8 jam",
        keterangan: "Untuk radang tenggorokan"
      }
    ],
    status: "Perlu Klarifikasi / Ditolak",
    catatan_apoteker: "KLARIFIKASI: Pasien memiliki riwayat alergi berat terhadap golongan Penisilin. Perlu konfirmasi ke dokter penulis resep untuk penggantian ke golongan Eritromisin/Makrolida.",
    dicatat_oleh: "apt. Melati Kusuma Dewi, S.Farm.",
    riwayat_status: [
      {
        status: "Menunggu Pemeriksaan",
        waktu: "2026-10-19T11:05:00",
        petugas: "Siti Rahmawati",
        catatan: "Resep diterima."
      },
      {
        status: "Perlu Klarifikasi / Ditolak",
        waktu: "2026-10-19T11:15:00",
        petugas: "apt. Melati Kusuma Dewi, S.Farm.",
        catatan: "Skrining klinis mendeteksi alergi pasien. Menunggu dokter pengganti."
      }
    ]
  }
];
