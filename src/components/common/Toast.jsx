import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const Toast = () => {
  const { toast } = usePharmacy();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md w-full px-4">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
            : isError
            ? 'bg-rose-50/95 border-rose-200 text-rose-900'
            : 'bg-pink-50/95 border-pink-200 text-slate-900'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-pink-600" />}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
