import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { StatusChangeModal } from './StatusChangeModal';

export const PrescriptionListView = ({ onOpenAddPrescription }) => {
  const { prescriptions } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [activePrescriptionForStatus, setActivePrescriptionForStatus] = useState(null);
  const [expandedRxId, setExpandedRxId] = useState(null);

  const statusFilters = [
    'Semua',
    'Menunggu Pemeriksaan',
    'Diproses',
    'Selesai',
    'Perlu Klarifikasi / Ditolak'
  ];

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchSearch =
      rx.nomor_resep.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.pasien.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.dokter.nama.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      selectedStatus === 'Semua' || rx.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Pemeriksaan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu Pemeriksaan
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Sedang Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Diserahkan
          </span>
        );
      case 'Perlu Klarifikasi / Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Perlu Klarifikasi / Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const toggleExpand = (id) => {
    setExpandedRxId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Etik Farmasi */}
      <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-xl bg-pink-100 text-pink-600 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Alur Pengelolaan & Peninjauan Resep Sesuai Regulasi
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Sistem ini berfungsi untuk mendokumentasikan resep fisik pasien secara kronologis. Apoteker bertugas memverifikasi legalitas, memeriksa dosis dan kontraindikasi, serta memperbarui status pelayanan dari tahap <em>Menunggu</em>, <em>Diproses</em>, hingga <em>Selesai</em>.
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor resep, nama pasien, atau dokter..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-slate-900 transition"
            />
          </div>

          <button
            onClick={onOpenAddPrescription}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Catat Resep Baru
          </button>
        </div>

        {/* Filter Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Status:
          </span>
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedStatus === st
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'Semua' ? `(${prescriptions.length})` : `(${prescriptions.filter(r => r.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Resep Pasien */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-pink-100 shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-base">Tidak ada resep yang ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => {
            const isExpanded = expandedRxId === rx.id;
            const rxDate = new Date(rx.tanggal_resep).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div
                key={rx.id}
                className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden transition hover:border-pink-200"
              >
                {/* Header Resep Card */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-pink-50/30 to-white border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-pink-100 text-pink-600 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{rx.nomor_resep}</span>
                        <span className="text-xs text-slate-400">&bull; Ditulis: {rxDate}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                        <span className="font-bold text-pink-700 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {rx.pasien.nama} ({rx.pasien.usia || 'Usia -'})
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> {rx.dokter.nama}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {getStatusBadge(rx.status)}
                    <button
                      onClick={() => setActivePrescriptionForStatus(rx)}
                      className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-sm shadow-pink-200 transition active:scale-95"
                    >
                      Ubah Status
                    </button>
                    <button
                      onClick={() => toggleExpand(rx.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                      title={isExpanded ? 'Tutup Detail' : 'Buka Detail'}
                    >
                      <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Ringkasan Item Obat yang Ditulis */}
                <div className="p-5 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Rincian Obat & Aturan Pakai:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rx.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                        >
                          <div className="flex justify-between items-start font-bold text-slate-900">
                            <span>{it.nama_obat}</span>
                            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-200 text-[11px]">
                              {it.jumlah}
                            </span>
                          </div>
                          <div className="text-slate-600 font-medium mt-1">
                            Signa: <span className="text-slate-800 font-semibold">{it.aturan_pakai}</span>
                          </div>
                          {it.keterangan && (
                            <div className="text-[11px] text-slate-500 mt-0.5 italic">
                              Ket: {it.keterangan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Catatan Apoteker Terkini */}
                  {rx.catatan_apoteker && (
                    <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Catatan Pelayanan / Apoteker:</strong> {rx.catatan_apoteker}
                      </div>
                    </div>
                  )}

                  {/* Riwayat Jejak Status Resep (Expanded View) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-4 h-4 text-pink-500" />
                        Jejak Perubahan Status Resep:
                      </h5>
                      <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-pink-200">
                        {rx.riwayat_status && rx.riwayat_status.map((log, lIdx) => {
                          const logTime = new Date(log.waktu).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <div key={lIdx} className="relative text-xs">
                              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-white ring-2 ring-pink-200" />
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{log.status}</span>
                                <span className="text-[11px] text-slate-400">&bull; {logTime}</span>
                              </div>
                              <p className="text-slate-600 mt-0.5">{log.catatan}</p>
                              <span className="text-[10px] text-slate-400">Petugas: {log.petugas}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detail Kontak Pasien & Dokter */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                          <strong className="block text-slate-700">Kontak Pasien:</strong>
                          <span className="text-slate-600">Telp: {rx.pasien.no_telepon || '-'}</span><br />
                          <span className="text-slate-600">Alamat: {rx.pasien.alamat || '-'}</span>
                        </div>
                        <div>
                          <strong className="block text-slate-700">Legalitas Dokter:</strong>
                          <span className="text-slate-600">{rx.dokter.sip || '-'}</span><br />
                          <span className="text-slate-600">{rx.dokter.klinik_rs || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Perubahan Status */}
      <StatusChangeModal
        isOpen={Boolean(activePrescriptionForStatus)}
        prescription={activePrescriptionForStatus}
        onClose={() => setActivePrescriptionForStatus(null)}
      />
    </div>
  );
};
