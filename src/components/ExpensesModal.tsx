import React, { useState } from 'react';
import { DollarSign, PlusCircle, Trash2, XCircle, Calendar, Receipt } from 'lucide-react';
import { Gasto } from '../types/database';
import { formatCurrency } from '../services/store';

interface ExpensesModalProps {
  gastos: Gasto[];
  onClose: () => void;
  onAgregarGasto: (gasto: Gasto) => void;
}

export const ExpensesModal: React.FC<ExpensesModalProps> = ({
  gastos,
  onClose,
  onAgregarGasto
}) => {
  const [descripcion, setDescripcion] = useState('');
  const [valorSalida, setValorSalida] = useState<number>(0);

  const totalGastos = gastos.reduce((sum, g) => sum + g.VALORSALIDA, 0);

  const handleGuardar = () => {
    if (!descripcion.trim() || valorSalida <= 0) {
      alert('Ingrese una descripción válida y un valor mayor a cero.');
      return;
    }

    const nuevoGasto: Gasto = {
      IDgastos: Date.now(),
      NUMEROGASTO: `GAS-${Math.floor(100 + Math.random() * 900)}`,
      DESCRIPCIONSALIDA: descripcion,
      FECHA: new Date().toISOString().split('T')[0],
      VALORSALIDA: valorSalida
    };

    onAgregarGasto(nuevoGasto);
    setDescripcion('');
    setValorSalida(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" /> SALIDAS DE CAJA Y GASTOS OPERATIVOS
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* REGISTRO NUEVO GASTO */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <span className="font-bold text-amber-400 block uppercase">REGISTRAR NUEVA SALIDA</span>

          <div>
            <label className="block text-slate-400 mb-1">CONCEPTO / DESCRIPCIÓN *</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Ej. Compra detergente lavandería / Bolsa insumos / Transporte..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-slate-400 mb-1">VALOR SALIDA ($) *</label>
              <input
                type="number"
                value={valorSalida || ''}
                onChange={e => setValorSalida(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-right font-mono font-bold text-amber-300 outline-none text-base focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleGuardar}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> REGISTRAR
            </button>
          </div>
        </div>

        {/* LISTADO DE GASTOS REGISTRADOS */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>HISTORIAL DE GASTOS DEL DÍA:</span>
            <span className="text-amber-400 font-mono">TOTAL: {formatCurrency(totalGastos)}</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {gastos.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl">
                No hay gastos registrados hoy
              </div>
            ) : (
              gastos.map(g => (
                <div key={g.IDgastos} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{g.DESCRIPCIONSALIDA}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{g.NUMEROGASTO} - {g.FECHA}</div>
                  </div>
                  <span className="font-extrabold text-amber-400 font-mono text-sm">
                    -{formatCurrency(g.VALORSALIDA)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl">
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
