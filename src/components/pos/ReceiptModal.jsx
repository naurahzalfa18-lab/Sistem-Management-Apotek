import React from 'react';
import { Printer, X, CheckCircle, Heart } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  const { settings } = usePharmacy();

  if (!isOpen || !transaction) return null;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const txDate = new Date(transaction.tanggal_waktu);
  const formattedDate = txDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = txDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-fade-in no-print-bg">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 my-8">
        {/* Header Aksi (Disembunyikan saat print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Transaksi Sukses</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Struk Printable */}
        <div id="printable-receipt" className="py-4 font-mono text-xs text-slate-800">
          {/* Info Apotek */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wider font-sans">
              {settings.pharmacyName}
            </h2>
            <p className="text-[11px] text-slate-600 font-sans mt-0.5">{settings.address}</p>
            <p className="text-[10px] text-slate-500 font-sans">Telp: {settings.phone}</p>
            <p className="text-[10px] text-slate-500 font-sans">{settings.siaNumber}</p>
            <p className="text-[10px] text-slate-500 font-sans">{settings.sipaNumber}</p>
            <p className="text-[10px] text-slate-700 font-sans font-semibold mt-0.5">APA: {settings.pharmacistName}</p>
          </div>

          {/* Info Transaksi */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Transaksi:</span>
              <span className="font-bold text-slate-900">{transaction.nomor_transaksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu:</span>
              <span>{formattedDate}, {formattedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kasir:</span>
              <span>{transaction.petugas}</span>
            </div>
            {transaction.catatan && transaction.catatan !== '-' && (
              <div className="flex justify-between">
                <span className="text-slate-500">Catatan:</span>
                <span>{transaction.catatan}</span>
              </div>
            )}
          </div>

          {/* Daftar Item Obat */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 grid grid-cols-12">
              <span className="col-span-6">Nama Obat</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Subtotal</span>
            </div>
            {transaction.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] items-start">
                <div className="col-span-6 pr-1">
                  <div className="font-semibold text-slate-900 leading-tight">{item.nama_obat_snapshot}</div>
                  <div className="text-[10px] text-slate-500">{formatRupiah(item.harga_satuan_snapshot)}</div>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-700">
                  {item.jumlah}
                </div>
                <div className="col-span-4 text-right font-bold text-slate-900">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Biaya */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-semibold">{formatRupiah(transaction.subtotal)}</span>
            </div>
            {transaction.diskon > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Diskon:</span>
                <span>-{formatRupiah(transaction.diskon)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200">
              <span className="text-slate-900 font-sans">TOTAL:</span>
              <span className="text-slate-900">{formatRupiah(transaction.total)}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-600">Metode Bayar ({transaction.metode_pembayaran}):</span>
              <span className="font-semibold">{formatRupiah(transaction.nominal_bayar)}</span>
            </div>
            {transaction.metode_pembayaran === 'Tunai' && (
              <div className="flex justify-between text-[11px] text-emerald-700 font-bold">
                <span>Kembalian:</span>
                <span>{formatRupiah(transaction.kembalian)}</span>
              </div>
            )}
          </div>

          {/* Footer Ucapan */}
          <div className="text-center pt-3 space-y-1 font-sans">
            <p className="text-[11px] font-bold text-pink-600 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
              {settings.receiptFooter}
            </p>
            <p className="text-[10px] text-slate-400">
              Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan tanpa persetujuan apoteker.
            </p>
          </div>
        </div>

        {/* Action Buttons (Cetak & Tutup) */}
        <div className="mt-6 flex gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center"
          >
            Selesai
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};
