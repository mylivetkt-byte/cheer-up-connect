import React, { useState } from 'react';
import { Building2, Save, XCircle } from 'lucide-react';
import { Empresa } from '../types/database';

interface CompanySettingsModalProps {
  empresa: Empresa;
  onSave: (nuevaEmpresa: Empresa) => void;
  onClose: () => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  empresa,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Empresa>({ ...empresa });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-400" /> DATOS DEL NEGOCIO / EMPRESA
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">NOMBRE COMERCIAL *</label>
            <input
              type="text"
              value={formData.ENOMBRE}
              onChange={e => setFormData({ ...formData, ENOMBRE: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">RAZÓN SOCIAL *</label>
            <input
              type="text"
              value={formData.RAZOSOCIAL}
              onChange={e => setFormData({ ...formData, RAZOSOCIAL: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">NIT / RUT</label>
              <input
                type="text"
                value={formData.NIT}
                onChange={e => setFormData({ ...formData, NIT: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">TELÉFONO</label>
              <input
                type="text"
                value={formData.ETELEFONO}
                onChange={e => setFormData({ ...formData, ETELEFONO: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">DIRECCIÓN FÍSICA</label>
            <input
              type="text"
              value={formData.EDIRECCION}
              onChange={e => setFormData({ ...formData, EDIRECCION: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">MENSAJE PIE DE RECIBO</label>
            <input
              type="text"
              value={formData.MENSAJE}
              onChange={e => setFormData({ ...formData, MENSAJE: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> GUARDAR DATOS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
