import React from 'react';
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  HeartPulse,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const { medicines, prescriptions } = usePharmacy();

  // Hitung jumlah peringatan untuk badge di menu
  const lowStockCount = medicines.filter(m => m.aktif && m.stok <= m.stok_minimum).length;
  const pendingRxCount = prescriptions.filter(r => r.status === 'Menunggu Pemeriksaan').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'medicines',
      label: 'Data Obat & Stok',
      icon: Pill,
      badge: lowStockCount > 0 ? (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {lowStockCount}
        </span>
      ) : null
    },
    {
      id: 'pos',
      label: 'Kasir & Transaksi',
      icon: ShoppingCart,
      badge: null
    },
    {
      id: 'prescriptions',
      label: 'Pencatatan Resep',
      icon: FileText,
      badge: pendingRxCount > 0 ? (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-100 text-pink-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pendingRxCount}
        </span>
      ) : null
    },
    {
      id: 'reports',
      label: 'Laporan Penjualan',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Pengaturan Apotek',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-pink-200/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">Apotek Sehat</h1>
              <p className="text-xs font-medium text-pink-600">Harmoni Medika</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-pink-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm shadow-pink-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </nav>

        {/* Footer Info Box */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/60">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Prototipe Aktif (Demo)
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            Data disimpan pada penyimpanan lokal browser.
          </p>
        </div>
      </aside>
    </>
  );
};
