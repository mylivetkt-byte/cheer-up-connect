import React, { useState } from 'react';
import { Shirt, Plus, Search, Edit3, Trash2, Barcode, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Articulo } from '../types/database';
import { formatCurrency } from '../services/store';

interface ArticlesViewProps {
  articulos: Articulo[];
  onSaveArticulo: (art: Articulo) => void;
  onDeleteArticulo: (id: number) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articulos,
  onSaveArticulo,
  onDeleteArticulo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingArticulo, setEditingArticulo] = useState<Partial<Articulo> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredArticulos = articulos.filter(art => {
    const matchesSearch =
      art.DESCRIPCION.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.CODBARRAS.includes(searchTerm) ||
      art.TALLA.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || art.ESTADO === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingArticulo({
      IDARTICULO: Date.now(),
      DESCRIPCION: '',
      TALLA: 'M',
      STOCK: 1,
      VALOR: 50000,
      VALORDEPOSITO: 40000,
      CODBARRAS: '770' + Math.floor(1000000 + Math.random() * 9000000),
      ESTADO: 'Disponible',
      CATEGORIA: 'Disfraces General',
      IMAGEN: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (art: Articulo) => {
    setEditingArticulo({ ...art });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingArticulo?.DESCRIPCION?.trim()) {
      alert('La descripción del artículo es obligatoria.');
      return;
    }

    onSaveArticulo(editingArticulo as Articulo);
    setShowModal(false);
    setEditingArticulo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-heading">
              CATÁLOGO DE DISFRACES & VESTUARIO
            </h2>
            <p className="text-xs text-slate-400">
              Gestión de inventario de trajes, tallas, tarifas de alquiler y depósitos en garantía
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> REGISTRAR NUEVO DISFRAZ / TRAJE
        </button>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por descripción, talla o código de barras..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">FILTRAR ESTADO:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 font-bold rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="ALL">TODOS LOS ESTADOS</option>
            <option value="Disponible">DISPONIBLES</option>
            <option value="Alquilado">ALQUILADOS</option>
            <option value="En Mantenimiento">EN MANTENIMIENTO</option>
          </select>
        </div>
      </div>

      {/* GRID DE DISFRACES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArticulos.map((art) => (
          <div
            key={art.IDARTICULO}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col group"
          >
            {/* PHOTO HEADER */}
            <div className="relative h-44 bg-slate-950 overflow-hidden">
              <img
                src={art.IMAGEN || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60'}
                alt={art.DESCRIPCION}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* TALLA BADGE */}
              <span className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/80 border border-slate-700 text-white rounded-lg text-xs font-black">
                TALLA: {art.TALLA}
              </span>

              {/* ESTADO BADGE */}
              <span
                className={`absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                  art.ESTADO === 'Alquilado'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : art.ESTADO === 'En Mantenimiento'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {art.ESTADO || 'Disponible'}
              </span>
            </div>

            {/* DETAILS */}
            <div className="p-4 flex-1 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm line-clamp-2">{art.DESCRIPCION}</h3>
                <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <Barcode className="w-3 h-3 text-slate-500" /> {art.CODBARRAS}
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Valor Alquiler:</span>
                  <strong className="text-emerald-400 font-mono">{formatCurrency(art.VALOR)}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Valor Depósito:</span>
                  <strong className="text-blue-400 font-mono">{formatCurrency(art.VALORDEPOSITO)}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <span>Stock Disponible:</span>
                  <strong className="text-white font-bold">{art.STOCK} Unid.</strong>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" /> EDITAR
                </button>
                <button
                  onClick={() => confirm('¿Desea eliminar este disfraz?') && onDeleteArticulo(art.IDARTICULO)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {showModal && editingArticulo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-rose-400" /> {editingArticulo.IDARTICULO ? 'EDITAR DISFRAZ' : 'NUEVO DISFRAZ'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">DESCRIPCIÓN DEL DISFRAZ / TRAJE *</label>
                <input
                  type="text"
                  value={editingArticulo.DESCRIPCION || ''}
                  onChange={e => setEditingArticulo({ ...editingArticulo, DESCRIPCION: e.target.value })}
                  placeholder="Ej. Disfraz Batman Caballero de la Noche"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">TALLA</label>
                  <input
                    type="text"
                    value={editingArticulo.TALLA || ''}
                    onChange={e => setEditingArticulo({ ...editingArticulo, TALLA: e.target.value })}
                    placeholder="S, M, L, XL, 10-12"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">STOCK CANTIDAD</label>
                  <input
                    type="number"
                    value={editingArticulo.STOCK || 0}
                    onChange={e => setEditingArticulo({ ...editingArticulo, STOCK: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">VALOR ALQUILER ($)</label>
                  <input
                    type="number"
                    value={editingArticulo.VALOR || 0}
                    onChange={e => setEditingArticulo({ ...editingArticulo, VALOR: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-400 font-bold rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">VALOR DEPÓSITO ($)</label>
                  <input
                    type="number"
                    value={editingArticulo.VALORDEPOSITO || 0}
                    onChange={e => setEditingArticulo({ ...editingArticulo, VALORDEPOSITO: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 text-blue-400 font-bold rounded-lg p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CÓDIGO DE BARRAS</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingArticulo.CODBARRAS || ''}
                    onChange={e => setEditingArticulo({ ...editingArticulo, CODBARRAS: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-700 font-mono text-xs rounded-lg p-2 text-white outline-none"
                  />
                  <button
                    onClick={() => setEditingArticulo({ ...editingArticulo, CODBARRAS: '770' + Math.floor(1000000 + Math.random() * 9000000) })}
                    className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Generar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL FOTO PRENDA</label>
                <input
                  type="text"
                  value={editingArticulo.IMAGEN || ''}
                  onChange={e => setEditingArticulo({ ...editingArticulo, IMAGEN: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none"
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
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                GUARDAR CAMBIOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
