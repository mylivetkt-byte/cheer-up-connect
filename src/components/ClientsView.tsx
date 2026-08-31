import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit3, DollarSign, Phone, MapPin, Building, FileText } from 'lucide-react';
import { Cliente } from '../types/database';
import { formatCurrency } from '../services/store';

interface ClientsViewProps {
  clientes: Cliente[];
  onSaveCliente: (cliente: Cliente) => void;
  onOpenAbonoModal: (cliente: Cliente) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clientes,
  onSaveCliente,
  onOpenAbonoModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState<Partial<Cliente> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredClientes = clientes.filter(c =>
    c.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.CEDULA.toString().includes(searchTerm) ||
    c.TELEFONO.includes(searchTerm)
  );

  const handleOpenCreate = () => {
    setEditingCliente({
      IDCLIENTES: Date.now(),
      CEDULA: Math.floor(100000000 + Math.random() * 900000000),
      NOMBRE: '',
      DIRECCION: '',
      TELEFONO: '',
      TELEFONO2: '',
      EMPRESA: '',
      DIRECCIONEMP: '',
      SALDO: 0,
      NOTA: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Cliente) => {
    setEditingCliente({ ...c });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingCliente?.NOMBRE?.trim() || !editingCliente?.CEDULA) {
      alert('Nombre y cédula son obligatorios.');
      return;
    }

    onSaveCliente(editingCliente as Cliente);
    setShowModal(false);
    setEditingCliente(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-heading">
              DIRECTORIO DE CLIENTES & REGISTRO DE ABONOS
            </h2>
            <p className="text-xs text-slate-400">
              Administración de clientes, empresas afiliadas y control de créditos y abonos parciales
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> REGISTRAR NUEVO CLIENTE
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por cédula, nombre o teléfono..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* CLIENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map((c) => (
          <div
            key={c.IDCLIENTES}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-white text-base">{c.NOMBRE}</h3>
                  <span className="text-xs text-purple-400 font-mono">CÉDULA: {c.CEDULA}</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                    c.SALDO > 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {c.SALDO > 0 ? `DEBE: ${formatCurrency(c.SALDO)}` : 'AL DÍA'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{c.TELEFONO} {c.TELEFONO2 ? `/ ${c.TELEFONO2}` : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{c.DIRECCION || 'Sin dirección registrada'}</span>
                </div>
                {c.EMPRESA && (
                  <div className="flex items-center gap-2 text-purple-300">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>{c.EMPRESA}</span>
                  </div>
                )}
                {c.NOTA && (
                  <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <FileText className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                    <p className="line-clamp-2">{c.NOTA}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => handleOpenEdit(c)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" /> EDITAR
              </button>
              <button
                onClick={() => onOpenAbonoModal(c)}
                className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> REGISTRAR ABONO
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR / EDITAR CLIENTE */}
      {showModal && editingCliente && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" /> DATOS DEL CLIENTE
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">CÉDULA / NIT *</label>
                <input
                  type="number"
                  value={editingCliente.CEDULA || ''}
                  onChange={e => setEditingCliente({ ...editingCliente, CEDULA: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">NOMBRE COMPLETO *</label>
                <input
                  type="text"
                  value={editingCliente.NOMBRE || ''}
                  onChange={e => setEditingCliente({ ...editingCliente, NOMBRE: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">TELÉFONO 1</label>
                  <input
                    type="text"
                    value={editingCliente.TELEFONO || ''}
                    onChange={e => setEditingCliente({ ...editingCliente, TELEFONO: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TELÉFONO 2</label>
                  <input
                    type="text"
                    value={editingCliente.TELEFONO2 || ''}
                    onChange={e => setEditingCliente({ ...editingCliente, TELEFONO2: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DIRECCIÓN</label>
                <input
                  type="text"
                  value={editingCliente.DIRECCION || ''}
                  onChange={e => setEditingCliente({ ...editingCliente, DIRECCION: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EMPRESA / INSTITUCIÓN</label>
                <input
                  type="text"
                  value={editingCliente.EMPRESA || ''}
                  onChange={e => setEditingCliente({ ...editingCliente, EMPRESA: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">OBSERVACIONES / NOTA</label>
                <textarea
                  rows={2}
                  value={editingCliente.NOTA || ''}
                  onChange={e => setEditingCliente({ ...editingCliente, NOTA: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
              >
                CANCELAR
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                GUARDAR CLIENTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
