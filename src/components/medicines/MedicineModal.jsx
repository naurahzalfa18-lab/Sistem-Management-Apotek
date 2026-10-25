import React, { useState, useEffect } from 'react';
import { X, Pill, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const MedicineModal = ({ isOpen, onClose, editingMedicine = null }) => {
  const { addMedicine, updateMedicine } = usePharmacy();

  const [formData, setFormData] = useState({
    kode_obat: '',
    nama: '',
    kategori: 'Obat Bebas',
    satuan: 'Strip (10 Tab)',
    harga_beli: '',
    harga_jual: '',
    stok: '',
    stok_minimum: '10',
    tanggal_kedaluwarsa: '',
    nomor_batch: '',
    aktif: true,
    deskripsi: ''
  });

  const [error, setError] = useState('');

  const kategoriOptions = [
    'Obat Bebas',
    'Obat Bebas Terbatas',
    'Obat Keras',
    'Suplemen & Vitamin',
    'Alat Kesehatan'
  ];

  const satuanOptions = [
    'Strip (10 Tab)',
    'Strip (10 Kap)',
    'Blister (10 Kap)',
    'Botol (100ml)',
    'Botol (60ml)',
    'Botol (30 Kap)',
    'Kotak (50 Pcs)',
    'Tube (15g)',
    'Sachet',
    'Ampul'
  ];

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        kode_obat: editingMedicine.kode_obat || '',
        nama: editingMedicine.nama || '',
        kategori: editingMedicine.kategori || 'Obat Bebas',
        satuan: editingMedicine.satuan || 'Strip (10 Tab)',
        harga_beli: editingMedicine.harga_beli ?? '',
        harga_jual: editingMedicine.harga_jual ?? '',
        stok: editingMedicine.stok ?? '',
        stok_minimum: editingMedicine.stok_minimum ?? '10',
        tanggal_kedaluwarsa: editingMedicine.tanggal_kedaluwarsa || '',
        nomor_batch: editingMedicine.nomor_batch || '',
        aktif: editingMedicine.aktif ?? true,
        deskripsi: editingMedicine.deskripsi || ''
      });
    } else {
      setFormData({
        kode_obat: '',
        nama: '',
        kategori: 'Obat Bebas',
        satuan: 'Strip (10 Tab)',
        harga_beli: '',
        harga_jual: '',
        stok: '',
        stok_minimum: '10',
        tanggal_kedaluwarsa: '',
        nomor_batch: '',
        aktif: true,
        deskripsi: ''
      });
    }
    setError('');
  }, [editingMedicine, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi Kolom Wajib
    if (!formData.kode_obat.trim()) {
      setError('Kode obat wajib diisi.');
      return;
    }
    if (!formData.nama.trim()) {
      setError('Nama obat wajib diisi.');
      return;
    }
    if (formData.harga_jual === '' || Number(formData.harga_jual) < 0) {
      setError('Harga jual harus diisi dengan angka positif atau 0.');
      return;
    }
    if (formData.stok === '' || Number(formData.stok) < 0) {
      setError('Jumlah stok harus diisi dengan angka positif atau 0.');
      return;
    }
    if (formData.stok_minimum === '' || Number(formData.stok_minimum) < 0) {
      setError('Batas minimum stok tidak boleh bernilai negatif.');
      return;
    }

    let result;
    if (editingMedicine) {
      result = updateMedicine(editingMedicine.id, formData);
    } else {
      result = addMedicine(formData);
    }

    if (!result.success) {
      setError(result.message);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 my-8">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-600">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {editingMedicine ? 'Edit Data Obat' : 'Tambah Obat Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingMedicine ? 'Perbarui informasi dan persediaan obat' : 'Masukkan informasi master obat baru ke sistem'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kode Obat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kode Obat <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="kode_obat"
                value={formData.kode_obat}
                onChange={handleChange}
                placeholder="cth: OB-PCT-500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
                required
              />
            </div>

            {/* Nama Obat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Obat <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="cth: Paracetamol 500mg Tablet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Golongan <span className="text-rose-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition bg-white"
              >
                {kategoriOptions.map(kat => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
            </div>

            {/* Bentuk / Satuan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bentuk / Satuan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                placeholder="cth: Strip (10 Tab)"
                list="satuan-options"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
                required
              />
              <datalist id="satuan-options">
                {satuanOptions.map(sat => (
                  <option key={sat} value={sat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Harga Beli */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harga Beli (Rp)
              </label>
              <input
                type="number"
                name="harga_beli"
                min="0"
                value={formData.harga_beli}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
              />
            </div>

            {/* Harga Jual */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harga Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="harga_jual"
                min="0"
                value={formData.harga_jual}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jumlah Stok */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jumlah Stok Saat Ini <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="stok"
                min="0"
                value={formData.stok}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition font-semibold"
                required
              />
            </div>

            {/* Stok Minimum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Batas Minimum Stok (Alert) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="stok_minimum"
                min="0"
                value={formData.stok_minimum}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nomor Batch */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Batch
              </label>
              <input
                type="text"
                name="nomor_batch"
                value={formData.nomor_batch}
                onChange={handleChange}
                placeholder="cth: BTC-2401"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
              />
            </div>

            {/* Tanggal Kedaluwarsa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Kedaluwarsa (Exp Date)
              </label>
              <input
                type="date"
                name="tanggal_kedaluwarsa"
                value={formData.tanggal_kedaluwarsa}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition bg-white"
              />
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Khasiat / Indikasi / Catatan
            </label>
            <textarea
              name="deskripsi"
              rows="2"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="cth: Pereda demam dan nyeri ringan."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition resize-none"
            />
          </div>

          {/* Checkbox Status Aktif */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="aktif"
                checked={formData.aktif}
                onChange={handleChange}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800">
                Status Obat Aktif (Tersedia untuk dijual di Kasir)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              {editingMedicine ? 'Simpan Perubahan' : 'Simpan Obat Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
