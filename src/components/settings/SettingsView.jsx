import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsView = () => {
  const { settings, updateSettings, resetToDefaultData } = usePharmacy();

  const [formData, setFormData] = useState({
    pharmacyName: settings.pharmacyName || '',
    slogan: settings.slogan || '',
    address: settings.address || '',
    phone: settings.phone || '',
    siaNumber: settings.siaNumber || '',
    sipaNumber: settings.sipaNumber || '',
    pharmacistName: settings.pharmacistName || '',
    receiptFooter: settings.receiptFooter || '',
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleResetConfirm = () => {
    resetToDefaultData();
    setIsResetConfirmOpen(false);
    // Reload form data from initial settings
    setFormData({
      pharmacyName: "Apotek Sehat Harmoni",
      slogan: "Sahabat Sehat Keluarga Anda",
      address: "Jl. Boulevard Medika No. 12, Kebayoran Baru, Jakarta Selatan",
      phone: "021-78901234 / 0812-9876-5432",
      siaNumber: "SIA: 503/042/SIA/DPMPTSP/2023",
      sipaNumber: "SIPA: 19920814/SIPA_31.74/2022/2045",
      pharmacistName: "apt. Melati Kusuma Dewi, S.Farm.",
      receiptFooter: "Semoga Lekas Sembuh. Simpan obat di tempat sejuk & jauhkan dari jangkauan anak-anak.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Pengaturan Profil Apotek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
          <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Profil & Identitas Legal Apotek</h3>
            <p className="text-xs text-slate-500">
              Informasi ini akan dicetak otomatis pada struk bukti transaksi dan header laporan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Apotek
              </label>
              <input
                type="text"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Lengkap Apotek
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Telepon & WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Apoteker Pengelola Apotek (APA)
              </label>
              <input
                type="text"
                name="pharmacistName"
                value={formData.pharmacistName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Izin Apotek (SIA)
              </label>
              <input
                type="text"
                name="siaNumber"
                value={formData.siaNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor SIPA Apoteker
              </label>
              <input
                type="text"
                name="sipaNumber"
                value={formData.sipaNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pesan / Catatan Kaki Struk (Receipt Footer)
            </label>
            <textarea
              name="receiptFooter"
              rows="2"
              value={formData.receiptFooter}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-900 outline-none transition resize-none"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Profil Apotek
            </button>
          </div>
        </form>
      </div>

      {/* Bagian Manajemen Data Demo */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manajemen Data Demo Sintetis</h3>
            <p className="text-xs text-slate-500">
              Muat ulang seluruh data pengujian (obat, transaksi, dan resep) ke kondisi awal
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Jika Anda telah melakukan beberapa transaksi kasir atau pengujian stok dan ingin mengembalikan kondisi data obat, stok awal, serta resep dokter ke dataset sintetis awal, Anda dapat menekan tombol di bawah.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Muat Ulang Data Contoh (Reset Demo)
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Reset Demo */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset ke Data Sintetis Awal?"
        message="Tindakan ini akan mengembalikan data obat, stok, riwayat transaksi, dan resep ke kondisi awal pengujian. Perubahan baru yang Anda buat akan ditimpa."
        confirmText="Ya, Reset Data Demo"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
