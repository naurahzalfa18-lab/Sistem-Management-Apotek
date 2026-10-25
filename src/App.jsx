import React, { useState } from 'react';
import { PharmacyProvider } from './context/PharmacyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { MedicineListView } from './components/medicines/MedicineListView';
import { MedicineModal } from './components/medicines/MedicineModal';
import { PosView } from './components/pos/PosView';
import { PrescriptionListView } from './components/prescriptions/PrescriptionListView';
import { PrescriptionModal } from './components/prescriptions/PrescriptionModal';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

function PharmacyApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modal State untuk Obat
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medicineFilter, setMedicineFilter] = useState('all');

  // Modal State untuk Resep
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const handleOpenAddMedicine = () => {
    setEditingMedicine(null);
    setIsMedicineModalOpen(true);
  };

  const handleOpenEditMedicine = (med) => {
    setEditingMedicine(med);
    setIsMedicineModalOpen(true);
  };

  const handleCloseMedicineModal = () => {
    setIsMedicineModalOpen(false);
    setEditingMedicine(null);
  };

  const handleOpenAddPrescription = () => {
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-pink-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigasi */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMobileOpen={setIsMobileOpen}
          onOpenAddMedicine={handleOpenAddMedicine}
          onOpenAddPrescription={handleOpenAddPrescription}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                setActiveTab={setActiveTab}
                onSelectMedicineFilter={(filter) => {
                  setMedicineFilter(filter);
                }}
                onOpenAddMedicine={handleOpenAddMedicine}
                onOpenAddPrescription={handleOpenAddPrescription}
              />
            )}

            {activeTab === 'medicines' && (
              <MedicineListView
                initialFilter={medicineFilter}
                onOpenAddMedicine={handleOpenAddMedicine}
                onOpenEditMedicine={handleOpenEditMedicine}
              />
            )}

            {activeTab === 'pos' && (
              <PosView />
            )}

            {activeTab === 'prescriptions' && (
              <PrescriptionListView
                onOpenAddPrescription={handleOpenAddPrescription}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <MedicineModal
        isOpen={isMedicineModalOpen}
        onClose={handleCloseMedicineModal}
        editingMedicine={editingMedicine}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={handleClosePrescriptionModal}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <PharmacyProvider>
      <PharmacyApp />
    </PharmacyProvider>
  );
}
