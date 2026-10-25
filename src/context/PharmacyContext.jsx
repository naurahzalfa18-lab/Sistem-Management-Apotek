import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MEDICINES,
  INITIAL_TRANSACTIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_SETTINGS
} from '../data/initialData';

const PharmacyContext = createContext();

// Helper untuk migrasi identitas otomatis dari localStorage agar nama lama tidak muncul
const migrateIdentity = (data) => {
  if (!data) return data;
  try {
    const jsonStr = JSON.stringify(data);
    const updatedStr = jsonStr
      .replace(/Apotek Sehat Harmoni/g, 'Naurah Pharm')
      .replace(/Sehat Harmoni/g, 'Naurah Pharm')
      .replace(/Harmoni Medika/g, 'Naurah Pharm')
      .replace(/apt\.\s*Melati Kusuma Dewi,\s*S\.Farm\./g, 'apt. Naurah Zalfa Mauliyanto, S.Farm.')
      .replace(/Melati Kusuma Dewi/g, 'Naurah Zalfa Mauliyanto')
      .replace(/Siti Rahmawati/g, 'Aliyah Farhana')
      .replace(/Andi Saputra/g, 'Dimas Prasetyo')
      .replace(/Tn\.\s*Bambang Sutrisno/g, 'Tn. Dimas Wardhana')
      .replace(/Ny\.\s*Ratna Dewi/g, 'Ny. Alya Rahmadina')
      .replace(/Tn\.\s*Agus Kurniawan/g, 'Tn. Reyhan Pratama')
      .replace(/Ny\.\s*Mega Utami/g, 'Ny. Safira Maharani')
      .replace(/dr\.\s*Hendra Pratama,\s*Sp\.PD/g, 'dr. Farhan Alatas, Sp.PD')
      .replace(/dr\.\s*Amanda Clarissa,\s*Sp\.A/g, 'dr. Clara Anindita, Sp.A')
      .replace(/dr\.\s*Budi Santoso,\s*Sp\.P/g, 'dr. Raditya Nugraha, Sp.P')
      .replace(/RS Paru Sehat/g, 'RS Paru Naurah Medika')
      .replace(/dr\.\s*M Faizal AlQadri/g, 'dr. Danial Fikri, Sp.A')
      .replace(/dr\.\s*Rian Firmansyah/g, 'dr. Danial Fikri, Sp.A')
      .replace(/Klinik Pratama Sehat Bersama/g, 'Klinik Pratama Naurah')
      .replace(/An\.\s*Kevin/g, 'An. Kenzo');
    return JSON.parse(updatedStr);
  } catch {
    return data;
  }
};

export const PharmacyProvider = ({ children }) => {
  // 1. Inisialisasi state dengan localStorage fallback ke initialData dan migrasi otomatis
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem('apotek_sehat_medicines');
      if (saved) {
        const parsed = JSON.parse(saved);
        const missingDefaults = INITIAL_MEDICINES.filter(
          initMed => !parsed.some(m => m.id === initMed.id || m.kode_obat === initMed.kode_obat)
        );
        return [...parsed, ...missingDefaults];
      }
      return INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('apotek_sehat_transactions');
      return saved ? migrateIdentity(JSON.parse(saved)) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('apotek_sehat_prescriptions');
      return saved ? migrateIdentity(JSON.parse(saved)) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('apotek_sehat_settings');
      if (saved) {
        const parsed = migrateIdentity(JSON.parse(saved));
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          pharmacyName: parsed.pharmacyName === "Apotek Sehat Harmoni" ? "Naurah Pharm" : (parsed.pharmacyName || "Naurah Pharm"),
          pharmacistName: parsed.pharmacistName?.includes("Melati") ? "apt. Naurah Zalfa Mauliyanto, S.Farm." : (parsed.pharmacistName || "apt. Naurah Zalfa Mauliyanto, S.Farm."),
          ownerName: parsed.ownerName || "Naurah Zalfa Mauliyanto",
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // State untuk notifikasi Toast global
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Simpan perubahan ke LocalStorage
  useEffect(() => {
    localStorage.setItem('apotek_sehat_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('apotek_sehat_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('apotek_sehat_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('apotek_sehat_settings', JSON.stringify(settings));
  }, [settings]);

  // ==========================================
  // MANAJEMEN OBAT & STOK
  // ==========================================

  const addMedicine = (newMedicine) => {
    // Validasi kode unik
    const codeExists = medicines.some(
      m => m.kode_obat.trim().toLowerCase() === newMedicine.kode_obat.trim().toLowerCase()
    );
    if (codeExists) {
      return { success: false, message: `Kode obat "${newMedicine.kode_obat}" sudah terdaftar.` };
    }

    // Validasi harga & stok non-negatif
    if (Number(newMedicine.harga_jual) < 0 || Number(newMedicine.stok) < 0) {
      return { success: false, message: "Harga jual dan stok tidak boleh bernilai negatif." };
    }

    const created = {
      ...newMedicine,
      id: `MED-${Date.now()}`,
      stok: Number(newMedicine.stok) || 0,
      stok_minimum: Number(newMedicine.stok_minimum) || 5,
      harga_beli: Number(newMedicine.harga_beli) || 0,
      harga_jual: Number(newMedicine.harga_jual) || 0,
      aktif: newMedicine.aktif !== undefined ? newMedicine.aktif : true,
    };

    setMedicines(prev => [created, ...prev]);
    showToast(`Obat "${created.nama}" berhasil ditambahkan.`);
    return { success: true, medicine: created };
  };

  const updateMedicine = (id, updatedFields) => {
    // Validasi kode unik jika diubah
    const codeExists = medicines.some(
      m => m.id !== id && m.kode_obat.trim().toLowerCase() === updatedFields.kode_obat.trim().toLowerCase()
    );
    if (codeExists) {
      return { success: false, message: `Kode obat "${updatedFields.kode_obat}" sudah digunakan obat lain.` };
    }

    if (Number(updatedFields.harga_jual) < 0 || Number(updatedFields.stok) < 0) {
      return { success: false, message: "Harga jual dan stok tidak boleh bernilai negatif." };
    }

    setMedicines(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedFields,
            stok: Number(updatedFields.stok),
            stok_minimum: Number(updatedFields.stok_minimum),
            harga_beli: Number(updatedFields.harga_beli),
            harga_jual: Number(updatedFields.harga_jual),
          };
        }
        return item;
      })
    );

    showToast(`Data obat "${updatedFields.nama}" berhasil diperbarui.`);
    return { success: true };
  };

  const deleteMedicine = (id) => {
    const target = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    showToast(`Obat "${target?.nama || id}" telah dihapus.`, 'info');
    return { success: true };
  };

  const toggleMedicineActive = (id) => {
    setMedicines(prev =>
      prev.map(m => (m.id === id ? { ...m, aktif: !m.aktif } : m))
    );
  };

  // ==========================================
  // TRANSAKSI PENJUALAN & KASIR (POS)
  // ==========================================

  const createTransaction = ({ items, metode_pembayaran, nominal_bayar, catatan, petugas }) => {
    if (!items || items.length === 0) {
      return { success: false, message: "Keranjang belanja masih kosong." };
    }

    // 1. Verifikasi ketersediaan stok obat saat ini dan tanggal kedaluwarsa secara ketat
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);

    for (const item of items) {
      const currentMed = medicines.find(m => m.id === item.obat_id);
      if (!currentMed) {
        return { success: false, message: `Obat "${item.nama_obat_snapshot}" tidak ditemukan di database.` };
      }
      if (!currentMed.aktif) {
        return { success: false, message: `Obat "${currentMed.nama}" sedang berstatus non-aktif.` };
      }
      // Validasi ketat obat kedaluwarsa sesuai regulasi
      if (currentMed.tanggal_kedaluwarsa) {
        const expDate = new Date(currentMed.tanggal_kedaluwarsa);
        expDate.setHours(0, 0, 0, 0);
        if (expDate < todayZero) {
          return {
            success: false,
            message: `Transaksi ditolak: Obat "${currentMed.nama}" sudah kedaluwarsa (${currentMed.tanggal_kedaluwarsa}) dan dilarang untuk dijual.`
          };
        }
      }
      if (item.jumlah > currentMed.stok) {
        return {
          success: false,
          message: `Stok "${currentMed.nama}" tidak mencukupi. Tersedia: ${currentMed.stok}, diminta: ${item.jumlah}.`
        };
      }
    }

    // 2. Hitung total
    const subtotal = items.reduce((acc, curr) => acc + (curr.subtotal || (curr.harga_satuan_snapshot * curr.jumlah)), 0);
    const total = subtotal;
    const paidAmount = Number(nominal_bayar) || total;
    const kembalian = Math.max(0, paidAmount - total);

    // 3. Buat nomor transaksi unik TRX-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const nomorTransaksi = `TRX-${dateStr}-${randomSuffix}`;

    const newTrx = {
      id: nomorTransaksi,
      nomor_transaksi: nomorTransaksi,
      tanggal_waktu: now.toISOString(),
      items: items.map(item => ({
        obat_id: item.obat_id,
        kode_obat: item.kode_obat,
        nama_obat_snapshot: item.nama_obat_snapshot,
        jumlah: item.jumlah,
        harga_satuan_snapshot: item.harga_satuan_snapshot,
        subtotal: item.jumlah * item.harga_satuan_snapshot
      })),
      subtotal,
      diskon: 0,
      total,
      metode_pembayaran: metode_pembayaran || 'Tunai',
      nominal_bayar: paidAmount,
      kembalian,
      petugas: petugas || 'Petugas Kasir Apotek',
      status: 'Selesai',
      catatan: catatan || '-'
    };

    // 4. Kurangi stok obat secara atomik
    setMedicines(prevMedicines => {
      return prevMedicines.map(med => {
        const boughtItem = items.find(it => it.obat_id === med.id);
        if (boughtItem) {
          const newStock = Math.max(0, med.stok - boughtItem.jumlah);
          return { ...med, stok: newStock };
        }
        return med;
      });
    });

    // 5. Simpan transaksi
    setTransactions(prev => [newTrx, ...prev]);
    showToast(`Transaksi ${nomorTransaksi} berhasil diproses.`);
    return { success: true, transaction: newTrx };
  };

  // ==========================================
  // PENCATATAN & PENGELOLAAN RESEP
  // ==========================================

  const createPrescription = (rxData) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const nomorResep = rxData.nomor_resep?.trim() || `RXP-${dateStr}-${randomSuffix}`;

    const newRx = {
      ...rxData,
      id: nomorResep,
      nomor_resep: nomorResep,
      tanggal_diterima: now.toISOString(),
      status: rxData.status || "Menunggu Pemeriksaan",
      riwayat_status: [
        {
          status: rxData.status || "Menunggu Pemeriksaan",
          waktu: now.toISOString(),
          petugas: rxData.dicatat_oleh || "Petugas Apotek",
          catatan: rxData.catatan_awal || "Resep baru dicatat ke dalam sistem."
        }
      ]
    };

    setPrescriptions(prev => [newRx, ...prev]);
    showToast(`Resep ${nomorResep} berhasil didaftarkan.`);
    return { success: true, prescription: newRx };
  };

  const updatePrescriptionStatus = (id, newStatus, catatanPetugas, namaPetugas) => {
    const now = new Date().toISOString();
    setPrescriptions(prev =>
      prev.map(rx => {
        if (rx.id === id || rx.nomor_resep === id) {
          const updatedHistory = [
            ...(rx.riwayat_status || []),
            {
              status: newStatus,
              waktu: now,
              petugas: namaPetugas || "Apoteker Jaga",
              catatan: catatanPetugas || `Status resep diubah menjadi ${newStatus}.`
            }
          ];
          return {
            ...rx,
            status: newStatus,
            catatan_apoteker: catatanPetugas || rx.catatan_apoteker,
            waktu_pembaruan: now,
            riwayat_status: updatedHistory
          };
        }
        return rx;
      })
    );

    showToast(`Status resep diperbarui menjadi: ${newStatus}`);
    return { success: true };
  };

  // ==========================================
  // PENGATURAN & RESET DEMO
  // ==========================================

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Pengaturan profil apotek berhasil disimpan.");
  };

  const resetToDefaultData = () => {
    setMedicines(INITIAL_MEDICINES);
    setTransactions(INITIAL_TRANSACTIONS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem('apotek_sehat_medicines');
    localStorage.removeItem('apotek_sehat_transactions');
    localStorage.removeItem('apotek_sehat_prescriptions');
    localStorage.removeItem('apotek_sehat_settings');
    showToast("Semua data berhasil direset ke data sintetis Naurah Pharm.", "info");
  };

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        transactions,
        prescriptions,
        settings,
        toast,
        showToast,
        // Medicine actions
        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleMedicineActive,
        // Transaction actions
        createTransaction,
        // Prescription actions
        createPrescription,
        updatePrescriptionStatus,
        // Settings & Demo
        updateSettings,
        resetToDefaultData,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
