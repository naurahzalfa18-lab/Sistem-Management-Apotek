import React from 'react';
import {
  Pill,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShoppingCart,
  FilePlus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const DashboardView = ({ setActiveTab, onSelectMedicineFilter, onOpenAddMedicine, onOpenAddPrescription }) => {
  const { medicines, transactions, prescriptions } = usePharmacy();

  // 1. Perhitungan Metrik Dinamis
  const activeMedicines = medicines.filter(m => m.aktif);
  const totalActive = activeMedicines.length;

  // Stok Rendah: stok <= stok_minimum
  const lowStockMedicines = activeMedicines.filter(m => m.stok <= m.stok_minimum);

  const todayZero = new Date();
  todayZero.setHours(0, 0, 0, 0);

  // Obat Sudah Kedaluwarsa
  const expiredMedicines = medicines.filter(m => {
    if (!m.tanggal_kedaluwarsa) return false;
    const expDate = new Date(m.tanggal_kedaluwarsa);
    expDate.setHours(0, 0, 0, 0);
    return expDate < todayZero;
  });

  // Mendekati Kedaluwarsa: <= 60 hari ke depan dan belum kedaluwarsa
  const nearExpiryMedicines = activeMedicines.filter(m => {
    if (!m.tanggal_kedaluwarsa) return false;
    const expDate = new Date(m.tanggal_kedaluwarsa);
    expDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expDate - todayZero) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  });

  // Transaksi Hari Ini
  const todayStr = todayZero.toISOString().slice(0, 10);
  const todayTransactions = transactions.filter(t => t.tanggal_waktu && t.tanggal_waktu.startsWith(todayStr));
  const todayRevenue = todayTransactions.reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Resep Menunggu Pemeriksaan
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Menunggu Pemeriksaan');

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCardClick = (tab, filter = 'all') => {
    if (tab === 'medicines' && onSelectMedicineFilter) {
      onSelectMedicineFilter(filter);
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Banner Ramah Pengguna */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 text-white p-6 sm:p-8 shadow-lg shadow-pink-200">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            Sistem Informasi Apotek Modern
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Apotek Sehat Harmoni
          </h2>
          <p className="mt-2 text-sm sm:text-base text-pink-100 leading-relaxed">
            Kelola persediaan obat, layani kasir dengan cepat, dan dokumentasikan resep pasien secara rapi, akurat, dan terpercaya.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('pos')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-pink-700 font-bold text-sm shadow-md hover:bg-pink-50 transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-pink-600" />
              Mulai Transaksi Kasir
            </button>
            <button
              onClick={onOpenAddMedicine}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-800/40 hover:bg-pink-800/60 text-white font-semibold text-sm backdrop-blur-md transition active:scale-95 border border-white/20"
            >
              <FilePlus className="w-4 h-4" />
              Tambah Obat Baru
            </button>
          </div>
        </div>
        {/* Decorative circle glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Alert Peringatan Obat Sudah Kedaluwarsa */}
      {expiredMedicines.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Peringatan: {expiredMedicines.length} Obat Sudah Kedaluwarsa
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Obat kedaluwarsa otomatis dilarang untuk dijual di kasir dan perlu segera diproses retur atau pemusnahan.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('medicines', 'expired')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm shrink-0"
          >
            Lihat Obat Kedaluwarsa
          </button>
        </div>
      )}

      {/* 4 Kartu Metrik Utama Sesuai FR-01 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Obat Aktif */}
        <div
          onClick={() => handleCardClick('medicines', 'all')}
          className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Obat Aktif
            </span>
            <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalActive}</span>
            <span className="text-xs text-slate-500">item produk</span>
          </div>
          <p className="mt-2 text-xs text-pink-600 font-medium flex items-center gap-1">
            Lihat katalog obat <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </p>
        </div>

        {/* Metrik 2: Stok Rendah */}
        <div
          onClick={() => handleCardClick('medicines', 'low_stock')}
          className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition cursor-pointer group ${
            lowStockMedicines.length > 0 ? 'border-amber-200 bg-amber-50/20' : 'border-pink-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Peringatan Stok Rendah
            </span>
            <div className={`p-2.5 rounded-xl transition ${
              lowStockMedicines.length > 0
                ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${lowStockMedicines.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockMedicines.length}
            </span>
            <span className="text-xs text-slate-500">perlu restock</span>
          </div>
          <p className="mt-2 text-xs text-amber-700 font-medium flex items-center gap-1">
            Filter obat menipis <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </p>
        </div>

        {/* Metrik 3: Mendekati Kedaluwarsa */}
        <div
          onClick={() => handleCardClick('medicines', 'near_expiry')}
          className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition cursor-pointer group ${
            nearExpiryMedicines.length > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-pink-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Mendekati Expired
            </span>
            <div className={`p-2.5 rounded-xl transition ${
              nearExpiryMedicines.length > 0
                ? 'bg-rose-100 text-rose-700 group-hover:bg-rose-500 group-hover:text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${nearExpiryMedicines.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {nearExpiryMedicines.length}
            </span>
            <span className="text-xs text-slate-500">&le; 60 hari ke depan</span>
          </div>
          <p className="mt-2 text-xs text-rose-700 font-medium flex items-center gap-1">
            Periksa tanggal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </p>
        </div>

        {/* Metrik 4: Penjualan Hari Ini */}
        <div
          onClick={() => setActiveTab('reports')}
          className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Omzet Hari Ini
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 block truncate">
              {formatRupiah(todayRevenue)}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              {todayTransactions.length} transaksi selesai
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            Lihat laporan omzet <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </p>
        </div>
      </div>

      {/* Grid 2 Kolom: Perhatian Khusus & Transaksi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Peringatan & Status Resep (1 Col) */}
        <div className="space-y-6">
          {/* Card Resep Perlu Verifikasi */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-pink-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-600" />
                Resep Masuk Menunggu Verifikasi
              </h3>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-pink-100 text-pink-700">
                {pendingPrescriptions.length}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {pendingPrescriptions.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  Semua resep telah selesai diproses!
                </div>
              ) : (
                pendingPrescriptions.map(rx => (
                  <div
                    key={rx.id}
                    onClick={() => setActiveTab('prescriptions')}
                    className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 hover:border-pink-300 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{rx.pasien.nama}</span>
                        <span className="text-[11px] text-slate-500">{rx.dokter.nama}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Menunggu
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-600 line-clamp-1">
                      {rx.items.map(it => it.nama_obat).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className="mt-4 w-full py-2 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition text-center"
            >
              Buka Modul Resep
            </button>
          </div>

          {/* Card Peringatan Obat Menipis */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-pink-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Obat Perlu Pengadaan
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Stok &le; Batas Min
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {lowStockMedicines.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">Seluruh stok obat berada dalam batas aman.</p>
              ) : (
                lowStockMedicines.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.nama}</h4>
                      <p className="text-[11px] text-slate-500">{item.kategori} &bull; Min: {item.stok_minimum}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        Sisa: {item.stok}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => handleCardClick('medicines', 'low_stock')}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
            >
              Lihat Semua Obat Stok Rendah
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Transaksi Terbaru (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-pink-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-pink-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Riwayat Transaksi Terkini</h3>
                <p className="text-xs text-slate-500">Transaksi penjualan kasir terbaru yang telah tercatat</p>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                Semua Transaksi <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List Transaksi */}
            <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Belum ada transaksi</p>
                  <p className="text-xs text-slate-400 mt-1">Gunakan modul kasir untuk melayani transaksi pertama.</p>
                </div>
              ) : (
                transactions.slice(0, 6).map((tx) => {
                  const txDate = new Date(tx.tanggal_waktu);
                  const timeFormatted = txDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  const dateFormatted = txDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

                  return (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-pink-50/30 px-2 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {tx.metode_pembayaran === 'QRIS' ? 'QR' : tx.metode_pembayaran === 'Tunai' ? 'Rp' : 'DB'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{tx.nomor_transaksi}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                              {tx.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {tx.items.length} jenis item &bull; {tx.petugas}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {formatRupiah(tx.total)}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateFormatted}, {timeFormatted}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan 6 transaksi terakhir</span>
            <button
              onClick={() => setActiveTab('pos')}
              className="text-pink-600 font-semibold hover:underline"
            >
              + Transaksi Baru di Kasir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
