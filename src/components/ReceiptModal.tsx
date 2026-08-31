import React from 'react';
import { Printer, XCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Factura, Empresa } from '../types/database';
import { formatCurrency } from '../services/store';

interface ReceiptModalProps {
  factura: Factura | null;
  empresa: Empresa;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  factura,
  empresa,
  onClose
}) => {
  if (!factura) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-hidden">
        {/* HEADER NO PRINT */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 no-print">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Printer className="w-5 h-5 text-rose-400" /> VISTA PREVIA RECIBO DE ALQUILER
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> IMPRIMIR RECIBO
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TIQUETE IMPRESO AREA (CON CLASE PRINTABLE AREA) */}
        <div className="printable-area bg-white text-slate-900 p-6 rounded-xl font-mono text-xs space-y-4 border border-slate-200 shadow-inner">
          {/* HEADER STORE */}
          <div className="text-center space-y-1 pb-3 border-b border-slate-300">
            <div className="text-lg font-black tracking-tight">{empresa.ENOMBRE}</div>
            <div className="text-[10px] text-slate-600">{empresa.RAZOSOCIAL} - NIT: {empresa.NIT}</div>
            <div className="text-[10px] text-slate-600">{empresa.EDIRECCION} | Tel: {empresa.ETELEFONO}</div>
            <div className="text-[10px] font-bold text-slate-800 mt-1">{empresa.MENSAJE}</div>
          </div>

          {/* RECIBO DETALLES */}
          <div className="flex justify-between text-[11px] pt-1">
            <div>
              <div>RECIBO ALQUILER: <strong>{factura.NUMEROFACT}</strong></div>
              <div>CLIENTE: <strong>{factura.CCLIENTE}</strong></div>
              <div>CÉDULA: {factura.CCEDULA}</div>
              <div>TELÉFONO: {factura.CTELEFONO}</div>
            </div>
            <div className="text-right">
              <div>F. SALIDA: {factura.FECHASALIDA}</div>
              <div>F. ENTRADA: {factura.FECHAENTRADA}</div>
              <div>ATENDIÓ: {factura.VENDEDOR}</div>
            </div>
          </div>

          {/* TABLA ITEMS */}
          <table className="w-full text-left border-t border-b border-slate-300 py-2">
            <thead>
              <tr className="border-b border-slate-200 text-[10px]">
                <th className="py-1">CANT</th>
                <th className="py-1">PRENDA / TRAJE</th>
                <th className="py-1 text-right">ALQUILER</th>
                <th className="py-1 text-right">DEPÓSITO</th>
              </tr>
            </thead>
            <tbody>
              {factura.items?.map((it, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5 font-bold">{it.CANTIDAD}</td>
                  <td className="py-1.5">{it.DESCRIPCION}</td>
                  <td className="py-1.5 text-right">{formatCurrency(it.TOTALALQUILER)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(it.TOTALDEPOSITO)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* RESUMEN TOTALES */}
          <div className="space-y-1 text-right text-xs pt-1">
            <div>TOTAL ALQUILER: <strong>{formatCurrency(factura.FTOTALALQUILER)}</strong></div>
            <div>TOTAL DEPÓSITO RETENIDO: <strong>{formatCurrency(factura.FTOTALDEPOSITO)}</strong></div>
            {factura.DESCUENTO > 0 && <div>DESCUENTO APLICADO: -{formatCurrency(factura.DESCUENTO)}</div>}
            <div className="text-sm font-black pt-1 border-t border-slate-400">
              GRAN TOTAL COBRADO: {formatCurrency(factura.FTOTALALQUILER + factura.FTOTALDEPOSITO - factura.DESCUENTO)}
            </div>
            <div className="text-[11px] text-slate-600">
              PAGADO: {formatCurrency(factura.PAGACON)} | CAMBIO: {formatCurrency(factura.CAMBIOS)}
            </div>
          </div>

          {/* PIE DE TIQUETE */}
          <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-slate-200">
            * Conserve este recibo indispensable para la devolución del depósito y reintegro del vestuario.
            <br />¡Gracias por su preferencia en La Casa Del Disfraz!
          </div>
        </div>
      </div>
    </div>
  );
};
