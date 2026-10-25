import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Receipt,
  Search,
  Printer,
  Eye,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ReceiptModal } from '../pos/ReceiptModal';

export const ReportsView = () => {
  const { transactions, medicines } = usePharmacy();

  // Filter tanggal: default dari awal bulan berjalan sampai hari ini
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  // 30 hari ke belakang sebagai default tanggal mulai
  const past30Days = new Date(today);
  past30Days.setDate(past30Days.getDate() - 30);
  const past30DaysStr = past30Days.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(past30DaysStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Filter transaksi berdasarkan rentang tanggal & nomor transaksi
  const filteredTransactions = transactions.filter(t => {
    const tDate = t.tanggal_waktu ? t.tanggal_waktu.slice(0, 10) : '';
    const matchDate = (!startDate || tDate >= startDate) && (!endDate || tDate <= endDate);
    const matchSearch =
      t.nomor_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.petugas.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDate && matchSearch;
  });

  // Metrik Penjualan pada Periode Terpilih
  const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalTransactionsCount = filteredTransactions.length;
  const totalItemsSold = filteredTransactions.reduce(
    (acc, curr) => acc + curr.items.reduce((sum, it) => sum + it.jumlah, 0),
    0
  );
  const avgBasketSize = totalTransactionsCount > 0 ? Math.round(totalRevenue / totalTransactionsCount) : 0;

  // Metrik Nilai Inventori Obat
  const totalActiveMeds = medicines.filter(m => m.aktif).length;
  const totalInventoryValue = medicines.reduce((acc, curr) => acc + (curr.stok * curr.harga_beli), 0);
  const totalPotentialSales = medicines.reduce((acc, curr) => acc + (curr.stok * curr.harga_jual), 0);

  return (
    <div className="space-y-6">
      {/* Bar Filter Rentang Tanggal */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-pink-500" />
            Rentang Tanggal Laporan:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-pink-500 bg-white"
            />
            <span className="text-xs text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-pink-500 bg-white"
            />
          </div>
        </div>

        {/* Search Transaksi */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor struk atau kasir..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-pink-500 transition"
          />
        </div>
      </div>

      {/* 4 Kartu Ringkasan Penjualan Sesuai Periode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block truncate">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Berdasarkan filter tanggal
            </span>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Frekuensi Transaksi
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {totalTransactionsCount}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Struk pembayaran terbit
            </span>
          </div>
        </div>

        {/* Total Item Terjual */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Item Obat Terjual
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {totalItemsSold}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Satuan produk fisik
            </span>
          </div>
        </div>

        {/* Rata-rata Nilai Belanja */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Transaksi
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block truncate">
              {formatRupiah(avgBasketSize)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Per struk belanja
            </span>
          </div>
        </div>
      </div>

      {/* Nilai Inventori Apotek */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-pink-400/5 to-white border border-pink-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Valuasi Persediaan Obat di Gudang & Etalase</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Dihitung dari total stok aktif dikalikan harga perolehan (modal beli)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold block">Nilai Aset Modal</span>
            <span className="text-base font-extrabold text-slate-900">{formatRupiah(totalInventoryValue)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold block">Potensi Nilai Jual</span>
            <span className="text-base font-extrabold text-pink-600">{formatRupiah(totalPotentialSales)}</span>
          </div>
        </div>
      </div>

      {/* Tabel Rincian Transaksi */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-pink-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Transaksi Selesai</h3>
          <span className="text-xs text-slate-400">
            {filteredTransactions.length} transaksi pada filter saat ini
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-3">Tanggal & Waktu</th>
                <th className="py-3 px-3">Kasir / Petugas</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3">Jumlah Item</th>
                <th className="py-3 px-3">Total Belanja</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada transaksi pada periode ini</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Ubah rentang tanggal untuk melihat transaksi lain.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => {
                  const txDate = new Date(tx.tanggal_waktu);
                  const formattedDateTime = txDate.toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={tx.id} className="hover:bg-pink-50/20 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {tx.nomor_transaksi}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {formattedDateTime}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium">
                        {tx.petugas}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.metode_pembayaran}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {tx.items.reduce((s, it) => s + it.jumlah, 0)} item ({tx.items.length} jenis)
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {formatRupiah(tx.total)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setViewingReceipt(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat Struk
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Struk Detail */}
      <ReceiptModal
        isOpen={Boolean(viewingReceipt)}
        transaction={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
      />
    </div>
  );
};
