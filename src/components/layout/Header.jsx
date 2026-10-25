import React from 'react';
import { Menu, Calendar, UserCheck, ShoppingBag, PlusCircle, FilePlus } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const Header = ({ activeTab, setActiveTab, setIsMobileOpen, onOpenAddMedicine, onOpenAddPrescription }) => {
  const { settings } = usePharmacy();

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Operasional',
          subtitle: 'Ringkasan performa penjualan, kondisi stok obat, dan resep aktif'
        };
      case 'medicines':
        return {
          title: 'Manajemen Data Obat & Stok',
          subtitle: 'Katalog obat, peringatan stok minimum, dan kontrol tanggal kedaluwarsa'
        };
      case 'pos':
        return {
          title: 'Kasir & Transaksi Penjualan',
          subtitle: 'Pencarian obat cepat, keranjang belanja, dan cetak bukti transaksi'
        };
      case 'prescriptions':
        return {
          title: 'Pencatatan & Alur Resep',
          subtitle: 'Dokumentasi resep dokter, verifikasi apoteker, dan status pelayanan'
        };
      case 'reports':
        return {
          title: 'Laporan & Riwayat Penjualan',
          subtitle: 'Rekap transaksi harian, perputaran inventori, dan omzet apotek'
        };
      case 'settings':
        return {
          title: 'Pengaturan Profil Apotek',
          subtitle: 'Identitas legal apotek, informasi APA, dan manajemen data demo'
        };
      default:
        return { title: 'Naurah Pharm', subtitle: 'Sistem Informasi Apotek' };
    }
  };

  const page = getPageInfo();

  // Format tanggal Indonesia: contoh "Selasa, 20 Oktober 2026"
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-white border-b border-pink-200/80 px-4 sm:px-6 py-4 sticky top-0 z-30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile hamburger + Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {page.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {page.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick actions + Staff & Date Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Action Buttons */}
          {activeTab !== 'pos' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
              title="Buka Halaman Kasir"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Kasir Cepat
            </button>
          )}

          {activeTab !== 'medicines' && onOpenAddMedicine && (
            <button
              onClick={onOpenAddMedicine}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Tambah Data Obat Baru"
            >
              <PlusCircle className="w-3.5 h-3.5 text-pink-500" />
              Obat Baru
            </button>
          )}

          {activeTab !== 'prescriptions' && onOpenAddPrescription && (
            <button
              onClick={onOpenAddPrescription}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Catat Resep Baru"
            >
              <FilePlus className="w-3.5 h-3.5 text-pink-500" />
              Resep Baru
            </button>
          )}

          {/* Date Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 text-slate-700 text-xs font-medium border border-pink-100">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>{todayFormatted}</span>
          </div>

          {/* Pharmacist & Admin Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200/60">
            <UserCheck className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="hidden md:inline font-semibold text-slate-900 leading-tight">{settings.pharmacistName}</span>
              <span className="md:hidden font-semibold text-slate-900">Apoteker Jaga</span>
              <span className="text-[10px] text-pink-600 font-medium leading-none mt-0.5">Admin: {settings.ownerName || 'Naurah Zalfa Mauliyanto'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
