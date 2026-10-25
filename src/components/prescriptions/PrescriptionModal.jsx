import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, AlertCircle, Save, ShieldAlert } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const PrescriptionModal = ({ isOpen, onClose }) => {
  const { createPrescription } = usePharmacy();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    nomor_resep: '',
    tanggal_resep: todayStr,
    pasien: {
      nama: '',
      usia: '',
      gender: 'Laki-laki',
      no_telepon: '',
      alamat: ''
    },
    dokter: {
      nama: '',
      sip: '',
      klinik_rs: ''
    },
    items: [
      {
        id: `RX-ITEM-${Date.now()}-1`,
        nama_obat: '',
        jumlah: '',
        aturan_pakai: '',
        keterangan: ''
      }
    ],
    catatan_awal: '',
    dicatat_oleh: 'apt. Naurah Zalfa Mauliyanto, S.Farm.'
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pasien: { ...prev.pasien, [name]: value }
    }));
    setError('');
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dokter: { ...prev.dokter, [name]: value }
    }));
    setError('');
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
    setError('');
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `RX-ITEM-${Date.now()}-${prev.items.length + 1}`,
          nama_obat: '',
          jumlah: '',
          aturan_pakai: '',
          keterangan: ''
        }
      ]
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.pasien.nama.trim()) {
      setError('Nama pasien wajib diisi.');
      return;
    }

    if (!formData.dokter.nama.trim()) {
      setError('Nama dokter penulis resep wajib diisi.');
      return;
    }

    const hasInvalidItem = formData.items.some(
      item => !item.nama_obat.trim() || !item.jumlah.trim() || !item.aturan_pakai.trim()
    );

    if (hasInvalidItem) {
      setError('Pastikan semua baris item obat memiliki Nama Obat, Jumlah, dan Aturan Pakai.');
      return;
    }

    const result = createPrescription(formData);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 my-8">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Catat Resep Dokter Baru</h3>
              <p className="text-xs text-slate-500">
                Dokumentasikan data resep fisik pasien untuk ditinjau oleh apoteker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Medis Resmi sesuai PRD */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Peringatan Etika Kefarmasian:</strong> Prototipe ini hanya mendokumentasikan data sebagaimana tertulis pada resep. Aplikasi <em>tidak membuat diagnosis klinis</em>, <em>tidak merekomendasikan dosis mandiri</em>, dan keputusan verifikasi sepenuhnya wewenang apoteker pengelola.
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Identitas Resep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Resep (Biarkan kosong untuk otomatis)
              </label>
              <input
                type="text"
                value={formData.nomor_resep}
                onChange={(e) => setFormData({ ...formData, nomor_resep: e.target.value })}
                placeholder="cth: RXP-20261020-0099"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Resep Ditulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.tanggal_resep}
                onChange={(e) => setFormData({ ...formData, tanggal_resep: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition bg-white"
                required
              />
            </div>
          </div>

          {/* Section: Identitas Pasien */}
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 space-y-3">
            <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider">
              Identitas Pasien
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Pasien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.pasien.nama}
                  onChange={handlePatientChange}
                  placeholder="cth: Tn. Dimas Wardhana"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Usia
                </label>
                <input
                  type="text"
                  name="usia"
                  value={formData.pasien.usia}
                  onChange={handlePatientChange}
                  placeholder="cth: 45 Tahun"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={formData.pasien.gender}
                  onChange={handlePatientChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={formData.pasien.no_telepon}
                  onChange={handlePatientChange}
                  placeholder="cth: 0812-3456-7890"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Alamat Domisili Pasien
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.pasien.alamat}
                onChange={handlePatientChange}
                placeholder="cth: Jl. Tebet Raya No. 15, Jakarta Selatan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
              />
            </div>
          </div>

          {/* Section: Dokter Peresep */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dokter Penulis Resep
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Dokter <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.dokter.nama}
                  onChange={handleDoctorChange}
                  placeholder="cth: dr. Farhan Alatas, Sp.PD"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  No. SIP Dokter
                </label>
                <input
                  type="text"
                  name="sip"
                  value={formData.dokter.sip}
                  onChange={handleDoctorChange}
                  placeholder="cth: SIP: 446/SIP/2022"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Klinik / Rumah Sakit
                </label>
                <input
                  type="text"
                  name="klinik_rs"
                  value={formData.dokter.klinik_rs}
                  onChange={handleDoctorChange}
                  placeholder="cth: RS Medika Pratama"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 text-xs text-slate-900 outline-none bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section: Daftar Obat Resep (Dynamic rows) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Obat yang Tertulis pada Resep
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris Obat
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Nama & Kekuatan Obat *"
                      value={item.nama_obat}
                      onChange={(e) => handleItemChange(index, 'nama_obat', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Jumlah *"
                      value={item.jumlah}
                      onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Aturan Pakai (cth: 3x1 tab sesudah makan) *"
                      value={item.aturan_pakai}
                      onChange={(e) => handleItemChange(index, 'aturan_pakai', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Keterangan"
                      value={item.keterangan}
                      onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      disabled={formData.items.length <= 1}
                      onClick={() => removeItemRow(index)}
                      className={`p-1.5 rounded-lg transition ${
                        formData.items.length <= 1
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan Awal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Awal / Skrining Fisik Resep
            </label>
            <textarea
              rows="2"
              value={formData.catatan_awal}
              onChange={(e) => setFormData({ ...formData, catatan_awal: e.target.value })}
              placeholder="Catatan keabsahan resep, riwayat alergi yang disebutkan pasien, atau keterangan etiket..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Resep Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
