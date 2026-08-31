import React, { useState } from 'react';
import { RotateCcw, Search, CheckCircle2, AlertTriangle, Printer, XCircle, ShieldCheck } from 'lucide-react';
import { Factura } from '../types/database';
import { formatCurrency } from '../services/store';

interface ReturnVestidoModalProps {
  facturas: Factura[];
  onClose: () => void;
  onProcesarDevolucion: (numeroFactura: string, valorDepositoDevuelto: number) => void;
}

export const ReturnVestidoModal: React.FC<ReturnVestidoModalProps> = ({
  facturas,
  onClose,
  onProcesarDevolucion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [valorDepositoDevolver, setValorDepositoDevolver] = useState<number>(0);
  const [motivoDeduccion, setMotivoDeduccion] = useState('');
  const [procesadoExitoso, setProcesadoExitoso] = useState(false);

  // Filtrar facturas pendientes de devolución
  const facturasPendientes = facturas.filter(f => f.ESTADOCLIENTE !== 'DEVUELTO Y DEPÓSITO ENTREGADO');

  const filteredFacturas = facturasPendientes.filter(f =>
    f.NUMEROFACT.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.CCLIENTE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.CCEDULA.includes(searchTerm)
  );

  const handleSelectFactura = (fact: Factura) => {
    setSelectedFactura(fact);
    setValorDepositoDevolver(fact.FTOTALDEPOSITO);
    setMotivoDeduccion('');
  };

  const handleConfirmarDevolucion = () => {
    if (!selectedFactura) return;

    onProcesarDevolucion(selectedFactura.NUMEROFACT, valorDepositoDevolver);
    setProcesadoExitoso(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <RotateCcw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-heading">
                ENTRADA VESTIDO Y DEVOLUCIÓN DE DEPÓSITO
              </h2>
              <p className="text-xs text-slate-400">
                Recepción de prendas alquiladas y liquidación del depósito en garantía
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {procesadoExitoso ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Entrada Vestido Procesada Exitosamente!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Se ha registrado la entrega del vestuario de la factura <strong className="text-emerald-400">{selectedFactura?.NUMEROFACT}</strong>. 
              Depósito devuelto al cliente: <strong className="text-emerald-400">{formatCurrency(valorDepositoDevolver)}</strong>.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                CERRAR Y VOLVER AL POS
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* BUSCADOR DE ALQUILERES PENDIENTES (5 COLS) */}
            <div className="md:col-span-5 space-y-3 border-r border-slate-800 pr-0 md:pr-4">
              <label className="block text-xs font-bold text-slate-300">
                BUSCAR ALQUILER PENDIENTE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Número factura, cliente o cédula..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {filteredFacturas.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No se encontraron alquileres pendientes de devolución
                  </div>
                ) : (
                  filteredFacturas.map(f => (
                    <div
                      key={f.IDFACTURA}
                      onClick={() => handleSelectFactura(f)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                        selectedFactura?.IDFACTURA === f.IDFACTURA
                          ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold text-slate-100">
                        <span className="text-emerald-400 font-mono">{f.NUMEROFACT}</span>
                        <span className="text-[10px] text-slate-400">{f.FECHASALIDA}</span>
                      </div>
                      <div className="text-slate-300 font-medium truncate mt-1">{f.CCLIENTE}</div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                        <span>Depósito: <strong className="text-blue-400">{formatCurrency(f.FTOTALDEPOSITO)}</strong></span>
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">PENDIENTE</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DETALLE Y VERIFICACIÓN DE PRENDAS (7 COLS) */}
            <div className="md:col-span-7 space-y-4">
              {selectedFactura ? (
                <div className="space-y-4">
                  {/* RESUMEN FACTURA */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">FACTURA DE ALQUILER</span>
                      <span className="text-sm font-extrabold font-mono text-emerald-400">{selectedFactura.NUMEROFACT}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{selectedFactura.CCLIENTE}</div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Cédula: {selectedFactura.CCEDULA}</span>
                      <span>Teléfono: {selectedFactura.CTELEFONO}</span>
                    </div>

                    {/* ITEMS ALQUILADOS */}
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Prendas a Entregar:</span>
                      {selectedFactura.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-slate-200">{item.DESCRIPCION}</span>
                          <span className="text-emerald-400 font-bold">x{item.CANTIDAD}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INSPECCIÓN DE DEPÓSITO */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-400" /> DEPÓSITO RETENIDO EN CAJA
                      </span>
                      <span className="text-sm font-mono text-blue-400">
                        {formatCurrency(selectedFactura.FTOTALDEPOSITO)}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="block text-slate-400">VALOR A DEVOLVER AL CLIENTE:</label>
                      <input
                        type="number"
                        max={selectedFactura.FTOTALDEPOSITO}
                        value={valorDepositoDevolver}
                        onChange={e => setValorDepositoDevolver(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-right font-mono font-black text-lg text-emerald-400 outline-none"
                      />
                    </div>

                    {valorDepositoDevolver < selectedFactura.FTOTALDEPOSITO && (
                      <div className="space-y-1 text-xs">
                        <label className="block text-rose-400 font-semibold">MOTIVO DEDUCCIÓN / DAÑO:</label>
                        <input
                          type="text"
                          value={motivoDeduccion}
                          onChange={e => setMotivoDeduccion(e.target.value)}
                          placeholder="Ej. Tarde de entrega / Daño menor en costura..."
                          className="w-full bg-slate-900 border border-rose-800 rounded-xl p-2 text-rose-200 outline-none text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConfirmarDevolucion}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-950/50 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> PROCESAR DEVOLUCIÓN DE PRENDAS Y PAGAR DEPÓSITO
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <RotateCcw className="w-12 h-12 mb-3 text-slate-700 animate-pulse" />
                  <p className="text-xs font-semibold">Seleccione un alquiler de la columna izquierda para procesar la entrada del vestido.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
