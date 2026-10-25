import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Pill,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ConfirmModal } from '../common/ConfirmModal';

export const MedicineListView = ({ onOpenAddMedicine, onOpenEditMedicine, initialFilter = 'all' }) => {
  const { medicines, deleteMedicine, toggleMedicineActive } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [stockFilter, setStockFilter] = useState(initialFilter); // 'all', 'low_stock', 'near_expiry', 'inactive'
  
  // State modal konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = [
    'Semua Kategori',
    'Obat Bebas',
    'Obat Bebas Terbatas',
    'Obat Keras',
    'Suplemen & Vitamin',
    'Alat Kesehatan'
  ];

  const todayZero = new Date();
  todayZero.setHours(0, 0, 0, 0);

  // Helper cek mendekati kedaluwarsa (<= 60 hari dan belum kedaluwarsa)
  const isNearExpiry = (dateStr) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp - todayZero) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  };

  // Helper cek sudah kedaluwarsa (sebelum hari ini)
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    exp.setHours(0, 0, 0, 0);
    return exp < todayZero;
  };

  // Filter Data
  const filteredMedicines = medicines.filter(med => {
    // 1. Pencarian nama atau kode
    const matchSearch =
      med.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.kode_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.nomor_batch && med.nomor_batch.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Filter Kategori
    const matchCategory =
      selectedCategory === 'Semua Kategori' || med.kategori === selectedCategory;

    // 3. Filter Kondisi Stok & Status
    let matchStock = true;
    if (stockFilter === 'low_stock') {
      matchStock = med.aktif && med.stok <= med.stok_minimum;
    } else if (stockFilter === 'near_expiry') {
      matchStock = med.aktif && isNearExpiry(med.tanggal_kedaluwarsa);
    } else if (stockFilter === 'expired') {
      matchStock = isExpired(med.tanggal_kedaluwarsa);
    } else if (stockFilter === 'inactive') {
      matchStock = !med.aktif;
    }

    return matchSearch && matchCategory && matchStock;
  });

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMedicine(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Badge kategori warna
  const getCategoryBadgeClass = (kategori) => {
    switch (kategori) {
      case 'Obat Bebas':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Obat Bebas Terbatas':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Obat Keras':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Suplemen & Vitamin':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode obat, nama obat, atau batch..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Add Medicine Button */}
          <button
            onClick={onOpenAddMedicine}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Obat Baru
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter Kondisi:
            </span>
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                stockFilter === 'all'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Obat ({medicines.length})
            </button>
            <button
              onClick={() => setStockFilter('low_stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                stockFilter === 'low_stock'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Stok Rendah ({medicines.filter(m => m.aktif && m.stok <= m.stok_minimum).length})
            </button>
            <button
              onClick={() => setStockFilter('near_expiry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                stockFilter === 'near_expiry'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              Mendekati Expired ({medicines.filter(m => m.aktif && isNearExpiry(m.tanggal_kedaluwarsa)).length})
            </button>
            <button
              onClick={() => setStockFilter('expired')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                stockFilter === 'expired'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              Sudah Kedaluwarsa ({medicines.filter(m => isExpired(m.tanggal_kedaluwarsa)).length})
            </button>
            <button
              onClick={() => setStockFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                stockFilter === 'inactive'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Non-Aktif ({medicines.filter(m => !m.aktif).length})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Golongan:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none focus:border-pink-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/60 border-b border-pink-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Kode & Nama Obat</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Satuan</th>
                <th className="py-3.5 px-3">Jumlah Stok</th>
                <th className="py-3.5 px-3">Harga Jual</th>
                <th className="py-3.5 px-3">Kedaluwarsa</th>
                <th className="py-3.5 px-3">No. Batch</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada obat yang cocok dengan filter</p>
                    <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const lowStock = med.stok <= med.stok_minimum;
                  const nearExp = isNearExpiry(med.tanggal_kedaluwarsa);
                  const expired = isExpired(med.tanggal_kedaluwarsa);

                  return (
                    <tr
                      key={med.id}
                      className={`hover:bg-pink-50/30 transition ${!med.aktif ? 'opacity-60 bg-slate-50/50' : ''}`}
                    >
                      {/* Kode & Nama */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{med.nama}</div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">{med.kode_obat}</div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${getCategoryBadgeClass(med.kategori)}`}>
                          {med.kategori}
                        </span>
                      </td>

                      {/* Satuan */}
                      <td className="py-3.5 px-3 text-xs text-slate-600 font-medium">
                        {med.satuan}
                      </td>

                      {/* Stok */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${lowStock ? 'text-amber-600 font-extrabold' : 'text-slate-900'}`}>
                            {med.stok}
                          </span>
                          <span className="text-[11px] text-slate-400">/ min {med.stok_minimum}</span>
                        </div>
                        {lowStock && med.aktif && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1">
                            <AlertTriangle className="w-3 h-3" /> Stok Menipis
                          </span>
                        )}
                        {med.stok === 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-1">
                            Habis
                          </span>
                        )}
                      </td>

                      {/* Harga Jual */}
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {formatRupiah(med.harga_jual)}
                      </td>

                      {/* Kedaluwarsa */}
                      <td className="py-3.5 px-3">
                        <div className="text-xs text-slate-700">
                          {med.tanggal_kedaluwarsa || '-'}
                        </div>
                        {expired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-0.5">
                            Kadaluwarsa
                          </span>
                        ) : nearExp ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-0.5">
                            <Clock className="w-3 h-3" /> Segera Exp
                          </span>
                        ) : null}
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-500">
                        {med.nomor_batch || '-'}
                      </td>

                      {/* Status Aktif */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => toggleMedicineActive(med.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                            med.aktif
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Klik untuk ubah status aktif/non-aktif"
                        >
                          {med.aktif ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Aktif
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-slate-500" /> Non-aktif
                            </>
                          )}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenEditMedicine(med)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition"
                            title="Edit Data Obat"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(med)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Obat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info jumlah obat */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <strong>{filteredMedicines.length}</strong> dari <strong>{medicines.length}</strong> total obat</span>
          <span>Naurah Pharm &bull; Sistem Inventori</span>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Obat?"
        message={`Apakah Anda yakin ingin menghapus data obat "${deleteTarget?.nama}" (${deleteTarget?.kode_obat})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Obat"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
