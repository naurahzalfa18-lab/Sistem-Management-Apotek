import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const StatusChangeModal = ({ isOpen, onClose, prescription }) => {
  const { updatePrescriptionStatus } = usePharmacy();

  const [selectedStatus, setSelectedStatus] = useState(prescription?.status || 'Menunggu Pemeriksaan');
  const [petugasName, setPetugasName] = useState('apt. Naurah Zalfa Mauliyanto, S.Farm.');
  const [notes, setNotes] = useState('');

  if (!isOpen || !prescription) return null;

  const statusOptions = [
    {
      value: 'Menunggu Pemeriksaan',
      label: 'Menunggu Pemeriksaan',
      desc: 'Resep baru diterima di loket, belum diperiksa legalitas dan kelengkapannya oleh apoteker.',
      color: 'amber'
    },
    {
      value: 'Diproses',
      label: 'Diproses',
      desc: 'Resep telah diverifikasi apoteker, sedang dalam penyiapan, peracikan, atau pelabelan etiket.',
      color: 'blue'
    },
    {
      value: 'Selesai',
      label: 'Selesai',
      desc: 'Obat telah diserahkan kepada pasien beserta pemberian Komunikasi, Informasi, & Edukasi (KIE).',
      color: 'emerald'
    },
    {
      value: 'Perlu Klarifikasi / Ditolak',
      label: 'Perlu Klarifikasi / Ditolak',
      desc: 'Terdapat kendala dosis, alergi, atau ketidakjelasan resep yang memerlukan konfirmasi dokter penulis.',
      color: 'rose'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePrescriptionStatus(prescription.id, selectedStatus, notes, petugasName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Perbarui Status Resep</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{prescription.nomor_resep} &bull; {prescription.pasien.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Status Pelayanan Baru
            </label>
            <div className="space-y-2">
              {statusOptions.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                    selectedStatus === opt.value
                      ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-100'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={selectedStatus === opt.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 text-pink-600 focus:ring-pink-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 leading-tight mt-0.5 block">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Petugas / Apoteker yang Memverifikasi
            </label>
            <input
              type="text"
              value={petugasName}
              onChange={(e) => setPetugasName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Apoteker / Alasan Perubahan Status
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Resep telah diperiksa, tidak ada interaksi obat. Siap diserahkan..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs text-slate-900 outline-none transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200 transition active:scale-95"
            >
              Simpan Status Resep
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
