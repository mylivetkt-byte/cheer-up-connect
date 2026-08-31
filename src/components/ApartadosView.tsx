import React, { useState } from 'react';
import { Calendar, Tag, Plus, CheckCircle2, Search, Clock } from 'lucide-react';
import { ReservaApartado } from '../types/database';
import { formatCurrency } from '../services/store';

interface ApartadosViewProps {
  apartados: ReservaApartado[];
  onAgregarApartado: (apartado: ReservaApartado) => void;
}

export const ApartadosView: React.FC<ApartadosViewProps> = ({
  apartados,
  onAgregarApartado
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteCedula, setClienteCedula] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [abonoInicial, setAbonoInicial] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [itemsDescripcion, setItemsDescripcion] = useState('');

  const filteredApartados = apartados.filter(a =>
    a.CLIENTE_NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.CLIENTE_CEDULA.includes(searchTerm) ||
    a.NUMERORESERVA.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!clienteNombre || !fechaEvento || total <= 0) {
      alert('Por favor complete todos los datos requeridos de la reserva.');
      return;
    }

    const nuevaReserva: ReservaApartado = {
      ID: Date.now(),
      NUMERORESERVA: `RES-${Math.floor(100 + Math.random() * 900)}`,
      CLIENTE_NOMBRE: clienteNombre,
      CLIENTE_CEDULA: clienteCedula,
      FECHA_EVENTO: fechaEvento,
      ABONO_INICIAL: abonoInicial,
      TOTAL: total,
      ESTADO: 'ACTIVA',
      ITEMS_DESCRIPCION: itemsDescripcion || 'Reserva de disfraz para evento'
    };

    onAgregarApartado(nuevaReserva);
    setShowModal(false);
    setClienteNombre('');
    setClienteCedula('');
    setFechaEvento('');
    setAbonoInicial(0);
    setTotal(0);
    setItemsDescripcion('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-heading">
              SISTEMA DE RESERVAS & APARTADOS
            </h2>
            <p className="text-xs text-slate-400">
              Reserva de trajes para fechas futuras (Halloween, Graduaciones, Obras de Teatro) con abono previo
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> REGISTRAR NUEVO APARTADO
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, cédula o número de reserva..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* APARTADOS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApartados.map((item) => (
          <div
            key={item.ID}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{item.NUMERORESERVA}</span>
                  <h3 className="font-extrabold text-white text-base">{item.CLIENTE_NOMBRE}</h3>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-black">
                  {item.ESTADO}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-slate-300 font-semibold">{item.ITEMS_DESCRIPCION}</div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Fecha del Evento: <strong className="text-white">{item.FECHA_EVENTO}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-semibold">
                <span className="text-slate-400">ABONADO: <strong className="text-emerald-400">{formatCurrency(item.ABONO_INICIAL)}</strong></span>
                <span className="text-slate-400">TOTAL: <strong className="text-amber-300">{formatCurrency(item.TOTAL)}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR APARTADO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> CREAR APARTADO DE DISFRAZ
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">NOMBRE DEL CLIENTE *</label>
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CÉDULA</label>
                <input
                  type="text"
                  value={clienteCedula}
                  onChange={e => setClienteCedula(e.target.value)}
                  placeholder="Cédula cliente"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PRENDAS RESERVADAS / DETALLE</label>
                <input
                  type="text"
                  value={itemsDescripcion}
                  onChange={e => setItemsDescripcion(e.target.value)}
                  placeholder="Ej. Disfraz Tuxedo Talla L + Sombrero"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">FECHA DEL EVENTO / ENTREGA *</label>
                <input
                  type="date"
                  value={fechaEvento}
                  onChange={e => setFechaEvento(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">ABONO INICIAL ($)</label>
                  <input
                    type="number"
                    value={abonoInicial || ''}
                    onChange={e => setAbonoInicial(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-400 font-bold rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TOTAL VALOR ($)</label>
                  <input
                    type="number"
                    value={total || ''}
                    onChange={e => setTotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-bold rounded-lg p-2 outline-none"
                  />
                </div>
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
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                GUARDAR RESERVA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
