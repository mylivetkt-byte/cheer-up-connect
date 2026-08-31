import React, { useState } from 'react';
import { DollarSign, CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { Cliente, AbonoCliente } from '../types/database';
import { formatCurrency } from '../services/store';

interface AbonosModalProps {
  cliente: Cliente | null;
  onClose: () => void;
  onGuardarAbono: (abono: AbonoCliente) => void;
}

export const AbonosModal: React.FC<AbonosModalProps> = ({
  cliente,
  onClose,
  onGuardarAbono
}) => {
  const [pagoEfectivo, setPagoEfectivo] = useState<number>(0);
  const [pagoTransferencia, setPagoTransferencia] = useState<number>(0);

  if (!cliente) return null;

  const totalAbono = (pagoEfectivo || 0) + (pagoTransferencia || 0);
  const saldoAnterior = cliente.SALDO || 0;
  const saldoDeber = Math.max(0, saldoAnterior - totalAbono);
  const numAbono = `ABO-${Date.now().toString().slice(-6)}`;

  const handleGuardar = () => {
    if (totalAbono <= 0) {
      alert('Debe ingresar un valor de abono mayor a cero.');
      return;
    }

    const nuevoAbono: AbonoCliente = {
      IDABONO_CLIENTE: Date.now(),
      NUMEROABONO: numAbono,
      ACLIENTE: cliente.NOMBRE,
      AFACTURA: 'REC-ABONO',
      PAGOEFECTIVO: pagoEfectivo,
      PAGOTRANFE: pagoTransferencia,
      FECHAABONO: new Date().toISOString().split('T')[0],
      SALDOANTERIOR: saldoAnterior,
      SALDODEBER: saldoDeber,
      TOTAL_ABONO: totalAbono
    };

    onGuardarAbono(nuevoAbono);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> REGISTRO DE ABONO DE CLIENTE
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
          <div className="text-slate-400">CLIENTE: <strong className="text-white">{cliente.NOMBRE}</strong></div>
          <div className="text-slate-400">CÉDULA: <span className="font-mono text-slate-300">{cliente.CEDULA}</span></div>
          <div className="text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>SALDO PENDIENTE ACTUAL:</span>
            <strong className="text-rose-400 font-mono text-sm">{formatCurrency(saldoAnterior)}</strong>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">ABONO EN EFECTIVO ($):</label>
            <input
              type="number"
              value={pagoEfectivo || ''}
              onChange={e => setPagoEfectivo(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-right font-mono font-bold text-emerald-400 outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">ABONO EN TRANSFERENCIA ($):</label>
            <input
              type="number"
              value={pagoTransferencia || ''}
              onChange={e => setPagoTransferencia(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-right font-mono font-bold text-cyan-300 outline-none text-base"
            />
          </div>

          <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1.5 font-semibold text-xs">
            <div className="flex justify-between text-slate-300">
              <span>TOTAL ABONADO:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">{formatCurrency(totalAbono)}</span>
            </div>
            <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
              <span>NUEVO SALDO PENDIENTE:</span>
              <span className="text-amber-300 font-mono font-extrabold text-sm">{formatCurrency(saldoDeber)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
          >
            CANCELAR
          </button>
          <button
            onClick={handleGuardar}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> GUARDAR ABONO
          </button>
        </div>
      </div>
    </div>
  );
};
