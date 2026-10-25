import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Pill,
  ArrowRight,
  Receipt,
  History,
  AlertCircle,
  Eye,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ReceiptModal } from './ReceiptModal';

export const PosView = () => {
  const { medicines, transactions, createTransaction } = usePharmacy();

  // Tab aktif di dalam POS: 'checkout' (Kasir Penjualan) atau 'history' (Riwayat Kasir)
  const [posTab, setPosTab] = useState('checkout');

  // State pencarian & filter katalog kasir
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State keranjang kasir
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tunai'); // 'Tunai', 'QRIS', 'Kartu Debit'
  const [cashAmount, setCashAmount] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State Modal Konfirmasi Sebelum Pembayaran (Sesuai Syarat 2)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // State struk modal setelah transaksi selesai atau untuk cetak ulang
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Pencarian riwayat transaksi kasir
  const [historySearch, setHistorySearch] = useState('');

  const categories = [
    'Semua',
    'Obat Bebas',
    'Obat Bebas Terbatas',
    'Obat Keras',
    'Suplemen & Vitamin',
    'Alat Kesehatan'
  ];

  const todayZero = new Date();
  todayZero.setHours(0, 0, 0, 0);

  // Helper cek apakah obat sudah kedaluwarsa (berdasarkan tanggal hari ini)
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

  // Filter obat aktif untuk kasir
  const availableMedicines = medicines.filter(med => {
    const matchSearch =
      med.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.kode_obat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === 'Semua' || med.kategori === selectedCategory;
    return med.aktif && matchSearch && matchCategory;
  });

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // ==========================================
  // LOGIKA KERANJANG & VALIDASI KEDALUWARSA & STOK
  // ==========================================

  const addToCart = (med) => {
    setErrorMessage('');

    // Syarat 1: Tolak penambahan obat kedaluwarsa melalui logika bisnis
    if (isExpired(med.tanggal_kedaluwarsa)) {
      setErrorMessage(`Obat "${med.nama}" sudah kedaluwarsa (${med.tanggal_kedaluwarsa}) dan dilarang untuk dijual.`);
      return;
    }

    if (med.stok <= 0) {
      setErrorMessage(`Stok obat "${med.nama}" sedang habis.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.obat_id === med.id);
      if (existing) {
        if (existing.jumlah >= med.stok) {
          setErrorMessage(`Tidak dapat menambah: kuantitas keranjang telah mencapai stok maksimal (${med.stok}).`);
          return prev;
        }
        return prev.map(item =>
          item.obat_id === med.id
            ? { ...item, jumlah: item.jumlah + 1, subtotal: (item.jumlah + 1) * item.harga_satuan_snapshot }
            : item
        );
      } else {
        return [
          ...prev,
          {
            obat_id: med.id,
            kode_obat: med.kode_obat,
            nama_obat_snapshot: med.nama,
            satuan: med.satuan,
            stok_maks: med.stok,
            harga_satuan_snapshot: med.harga_jual,
            jumlah: 1,
            subtotal: med.harga_jual
          }
        ];
      }
    });
  };

  const updateQuantity = (obatId, newQty) => {
    setErrorMessage('');
    const targetMedicine = medicines.find(m => m.id === obatId);
    if (!targetMedicine) return;

    if (newQty <= 0) {
      removeFromCart(obatId);
      return;
    }

    if (newQty > targetMedicine.stok) {
      setErrorMessage(`Jumlah tidak boleh melebihi stok yang tersedia (${targetMedicine.stok}).`);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.obat_id === obatId
          ? {
              ...item,
              jumlah: newQty,
              subtotal: newQty * item.harga_satuan_snapshot
            }
          : item
      )
    );
  };

  const removeFromCart = (obatId) => {
    setCart(prev => prev.filter(item => item.obat_id !== obatId));
  };

  const clearCart = () => {
    setCart([]);
    setErrorMessage('');
    setCashAmount('');
  };

  // Hitung total belanja
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  const cartTotal = cartSubtotal;
  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.jumlah, 0);

  const numericCash = Number(cashAmount) || 0;
  const changeAmount = Math.max(0, numericCash - cartTotal);

  // Set Cash Cepat
  const handlePresetCash = (amount) => {
    setCashAmount(amount.toString());
  };

  // Validasi sebelum membuka Modal Konfirmasi (Syarat 2)
  const handleInitiatePayment = () => {
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Keranjang masih kosong. Pilih obat terlebih dahulu.');
      return;
    }

    // Validasi ulang apakah ada obat yang kedaluwarsa di keranjang
    for (const item of cart) {
      const currentMed = medicines.find(m => m.id === item.obat_id);
      if (currentMed && isExpired(currentMed.tanggal_kedaluwarsa)) {
        setErrorMessage(`Item "${item.nama_obat_snapshot}" di keranjang sudah kedaluwarsa. Hapus item tersebut untuk melanjutkan.`);
        return;
      }
    }

    if (paymentMethod === 'Tunai') {
      if (numericCash < cartTotal) {
        setErrorMessage(`Nominal uang tunai (${formatRupiah(numericCash)}) kurang dari total belanja (${formatRupiah(cartTotal)}).`);
        return;
      }
    }

    // Buka modal ringkasan konfirmasi
    setIsConfirmModalOpen(true);
  };

  // Eksekusi final transaksi setelah disetujui kasir di modal konfirmasi
  const handleFinalizeTransaction = () => {
    setIsProcessing(true);

    const result = createTransaction({
      items: cart,
      metode_pembayaran: paymentMethod,
      nominal_bayar: paymentMethod === 'Tunai' ? numericCash : cartTotal,
      catatan: customerNote,
      petugas: settings.pharmacistName || 'apt. Naurah Zalfa Mauliyanto, S.Farm.'
    });

    setIsProcessing(false);
    setIsConfirmModalOpen(false);

    if (result.success) {
      setActiveReceipt(result.transaction);
      clearCart();
    } else {
      setErrorMessage(result.message);
    }
  };

  // Filter riwayat transaksi kasir
  const filteredHistory = transactions.filter(t => {
    return (
      t.nomor_transaksi.toLowerCase().includes(historySearch.toLowerCase()) ||
      t.petugas.toLowerCase().includes(historySearch.toLowerCase()) ||
      (t.catatan && t.catatan.toLowerCase().includes(historySearch.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher POS: Transaksi Kasir vs Riwayat Transaksi (Syarat 4) */}
      <div className="bg-white p-2 rounded-2xl border border-pink-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setPosTab('checkout')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              posTab === 'checkout'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm shadow-pink-200'
                : 'bg-pink-50/60 text-slate-700 hover:bg-pink-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Kasir & Penjualan
            {cart.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-pink-700 rounded-full text-[10px] font-extrabold">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setPosTab('history')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              posTab === 'history'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm shadow-pink-200'
                : 'bg-pink-50/60 text-slate-700 hover:bg-pink-100'
            }`}
          >
            <History className="w-4 h-4" />
            Riwayat Transaksi Kasir ({transactions.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Kasir Aktif: <strong className="text-slate-800">{settings.pharmacistName || 'apt. Naurah Zalfa Mauliyanto, S.Farm.'}</strong>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAMPILAN 1: CHECKOUT & KATALOG KASIR                 */}
      {/* ==================================================== */}
      {posTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SISI KIRI: KATALOG OBAT KASIR (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari obat cepat untuk kasir (nama atau kode)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-pink-50/70 text-slate-600 hover:bg-pink-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Produk Obat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {availableMedicines.length === 0 ? (
                <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-pink-100">
                  <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">Tidak ada obat yang ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau pilih kategori Semua.</p>
                </div>
              ) : (
                availableMedicines.map((med) => {
                  const inCartItem = cart.find(item => item.obat_id === med.id);
                  const inCartQty = inCartItem ? inCartItem.jumlah : 0;
                  const remainingStock = med.stok - inCartQty;
                  const isOutOfStock = med.stok === 0;
                  const isLowStock = med.stok <= med.stok_minimum;
                  const nearExp = isNearExpiry(med.tanggal_kedaluwarsa);
                  const expired = isExpired(med.tanggal_kedaluwarsa);

                  return (
                    <div
                      key={med.id}
                      className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between ${
                        expired
                          ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200'
                          : isOutOfStock
                          ? 'border-slate-200 opacity-60 bg-slate-50'
                          : inCartQty > 0
                          ? 'border-pink-300 ring-2 ring-pink-100 shadow-sm'
                          : 'border-pink-100 hover:border-pink-300 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {med.kategori}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {med.kode_obat}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                          {med.nama}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{med.satuan}</p>

                        {/* Stock Badges & Expiry Warnings */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            Stok: {med.stok}
                          </span>

                          {/* Syarat 1: Badge Peringatan Kedaluwarsa */}
                          {expired ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" /> Sudah Kedaluwarsa
                            </span>
                          ) : nearExp ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Segera Exp
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Harga</span>
                          <span className="text-sm font-extrabold text-pink-600">
                            {formatRupiah(med.harga_jual)}
                          </span>
                        </div>

                        {/* Syarat 1: Nonaktifkan tombol pilih untuk obat yang sudah kedaluwarsa */}
                        <button
                          onClick={() => addToCart(med)}
                          disabled={isOutOfStock || remainingStock <= 0 || expired}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                            expired
                              ? 'bg-rose-100 text-rose-700 border border-rose-200 cursor-not-allowed opacity-90'
                              : isOutOfStock || remainingStock <= 0
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm shadow-pink-200'
                          }`}
                        >
                          {expired ? (
                            'Kedaluwarsa'
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              {inCartQty > 0 ? `Tambah (${inCartQty})` : 'Pilih'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SISI KANAN: KERANJANG KASIR & PEMBAYARAN (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-pink-100 shadow-lg p-5 flex flex-col justify-between">
              <div>
                {/* Header Keranjang */}
                <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Keranjang Kasir</h3>
                      <p className="text-xs text-slate-500">{cart.length} jenis item ({totalItemsCount} unit)</p>
                    </div>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline"
                    >
                      Kosongkan
                    </button>
                  )}
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* List Item Keranjang */}
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <ShoppingCart className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Keranjang masih kosong</p>
                      <p className="text-xs text-slate-400 mt-1">Pilih obat dari katalog di sisi kiri untuk memulai.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.obat_id}
                        className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {item.nama_obat_snapshot}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {formatRupiah(item.harga_satuan_snapshot)} &bull; {item.satuan}
                          </p>
                          <div className="text-xs font-extrabold text-pink-600 mt-1">
                            Subtotal: {formatRupiah(item.subtotal)}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-xl border border-pink-200 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.obat_id, item.jumlah - 1)}
                              className="p-1 rounded-lg hover:bg-pink-50 text-slate-600 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-900">
                              {item.jumlah}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.obat_id, item.jumlah + 1)}
                              className="p-1 rounded-lg hover:bg-pink-50 text-pink-600 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.obat_id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus dari keranjang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bagian Perhitungan & Pembayaran */}
              {cart.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
                  {/* Total Calculation */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal Belanja:</span>
                      <span className="font-semibold text-slate-900">{formatRupiah(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Tagihan:</span>
                      <span className="text-xl text-pink-600 font-extrabold">{formatRupiah(cartTotal)}</span>
                    </div>
                  </div>

                  {/* Pilihan Metode Pembayaran */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('Tunai'); setCashAmount(cartTotal.toString()); }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                          paymentMethod === 'Tunai'
                            ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-100'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        Tunai
                      </button>

                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('QRIS'); setCashAmount(cartTotal.toString()); }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                          paymentMethod === 'QRIS'
                            ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-100'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        QRIS
                      </button>

                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('Kartu Debit'); setCashAmount(cartTotal.toString()); }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                          paymentMethod === 'Kartu Debit'
                            ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-100'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Debit
                      </button>
                    </div>
                  </div>

                  {/* Input Uang Tunai & Kembalian jika Pembayaran Tunai */}
                  {paymentMethod === 'Tunai' && (
                    <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Uang Diterima (Rp):</span>
                        <button
                          type="button"
                          onClick={() => handlePresetCash(cartTotal)}
                          className="text-pink-600 hover:underline text-[11px]"
                        >
                          Uang Pas
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Masukkan nominal uang tunai..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm font-bold text-slate-900 outline-none transition"
                      />

                      {/* Preset Buttons */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[20000, 50000, 100000, 200000].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handlePresetCash(val)}
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-pink-300 transition"
                          >
                            {formatRupiah(val)}
                          </button>
                        ))}
                      </div>

                      {/* Kembalian */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-bold">
                        <span className="text-slate-600">Kembalian:</span>
                        <span className={`text-sm ${numericCash < cartTotal ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {numericCash < cartTotal ? 'Uang Kurang' : formatRupiah(changeAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Catatan Pelanggan */}
                  <div>
                    <input
                      type="text"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="Catatan transaksi (opsional)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition"
                    />
                  </div>

                  {/* Syarat 2: Tombol Menampilkan Modal Ringkasan Konfirmasi */}
                  <button
                    type="button"
                    disabled={isProcessing || (paymentMethod === 'Tunai' && numericCash < cartTotal)}
                    onClick={handleInitiatePayment}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 active:scale-95 ${
                      isProcessing || (paymentMethod === 'Tunai' && numericCash < cartTotal)
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Proses Pembayaran ({formatRupiah(cartTotal)})
                  </button>
                </div>
              )}
            </div>

            {/* Syarat 4: Widget Transaksi Terakhir di Kasir untuk Akses Cepat Cetak Struk */}
            {transactions.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-pink-50">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-pink-500" />
                    Transaksi Kasir Terakhir
                  </span>
                  <button
                    onClick={() => setPosTab('history')}
                    className="text-[11px] font-semibold text-pink-600 hover:underline flex items-center gap-0.5"
                  >
                    Lihat Semua <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {transactions.slice(0, 2).map((tx) => (
                  <div key={tx.id} className="pt-2 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">{tx.nomor_transaksi}</span>
                      <span className="text-[11px] text-slate-500">
                        {tx.items.length} item &bull; {formatRupiah(tx.total)} ({tx.metode_pembayaran})
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveReceipt(tx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition shrink-0"
                    >
                      <Printer className="w-3 h-3" /> Cetak Struk
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAMPILAN 2: RIWAYAT TRANSAKSI KASIR (Syarat 4)       */}
      {/* ==================================================== */}
      {posTab === 'history' && (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-pink-600" />
                Riwayat Transaksi Kasir
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar seluruh transaksi penjualan yang telah diproses di loket kasir
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Cari nomor transaksi atau kasir..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-pink-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-pink-50/50 border-b border-pink-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">No. Transaksi</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Petugas Kasir</th>
                  <th className="py-3 px-3">Metode Bayar</th>
                  <th className="py-3 px-3">Jumlah Item</th>
                  <th className="py-3 px-3">Total Belanja</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">Belum ada transaksi yang sesuai</p>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((tx) => {
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
                        <td className="py-3.5 px-3 text-slate-800">
                          {tx.items.reduce((s, it) => s + it.jumlah, 0)} item ({tx.items.length} jenis)
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {formatRupiah(tx.total)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setActiveReceipt(tx)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
                          >
                            <Printer className="w-3.5 h-3.5" /> Lihat & Cetak Struk
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
      )}

      {/* ==================================================== */}
      {/* SYARAT 2: MODAL RINGKASAN KONFIRMASI SEBELUM BAYAR   */}
      {/* ==================================================== */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-pink-100 my-8">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Konfirmasi Pembayaran Kasir</h3>
                  <p className="text-xs text-slate-500">
                    Pastikan rincian transaksi dan pembayaran sudah sesuai
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Isi Ringkasan */}
            <div className="mt-4 space-y-4">
              {/* Box Rincian Keuangan */}
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200/60 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Kuantitas Item:</span>
                  <span className="font-bold text-slate-900">{totalItemsCount} unit ({cart.length} jenis obat)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Metode Pembayaran:</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-pink-200 font-bold text-pink-700">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-pink-200/60">
                  <span>Total Tagihan:</span>
                  <span className="text-base text-pink-600 font-extrabold">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Uang yang Dibayarkan:</span>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(paymentMethod === 'Tunai' ? numericCash : cartTotal)}
                  </span>
                </div>
                {paymentMethod === 'Tunai' && (
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-700 pt-1 border-t border-pink-100">
                    <span>Uang Kembalian:</span>
                    <span className="text-sm font-extrabold">{formatRupiah(changeAmount)}</span>
                  </div>
                )}
              </div>

              {/* Rincian Item Keranjang Ringkas */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Item:
                </h5>
                <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.nama_obat_snapshot}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.jumlah} &times; {formatRupiah(item.harga_satuan_snapshot)}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        {formatRupiah(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {customerNote && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <strong>Catatan:</strong> {customerNote}
                </div>
              )}

              {/* Informasi Audit Pengurangan Stok */}
              <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-800 border border-amber-200 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Setelah tombol konfirmasi ditekan, stok obat akan langsung dipotong <strong>satu kali secara permanen</strong> dan nomor transaksi unik akan diterbitkan.
                </span>
              </div>
            </div>

            {/* Tombol Aksi Konfirmasi */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleFinalizeTransaction}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isProcessing ? 'Menyimpan...' : 'Konfirmasi & Selesaikan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Struk Pembayaran (Untuk Transaksi Baru atau Cetak Ulang Riwayat) */}
      <ReceiptModal
        isOpen={Boolean(activeReceipt)}
        transaction={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
