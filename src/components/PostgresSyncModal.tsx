import React, { useState } from 'react';
import { Database, Download, Copy, Check, Terminal, Table, Server } from 'lucide-react';
import { AppState, generatePostgresDump } from '../services/store';

interface PostgresSyncModalProps {
  appState: AppState;
  onClose: () => void;
}

export const PostgresSyncModal: React.FC<PostgresSyncModalProps> = ({
  appState,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const sqlDump = generatePostgresDump(appState);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlDump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lacasadeldisfraz_pg_dump_${new Date().toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tables = [
    { name: 'ARTICULO', rows: appState.articulos.length, desc: 'Inventario prendas y depósitos' },
    { name: 'CLIENTES', rows: appState.clientes.length, desc: 'Directorio de clientes y saldos' },
    { name: 'FACTURA', rows: appState.facturas.length, desc: 'Encabezado alquileres y recibos' },
    { name: 'CAMPOFACTURA', rows: appState.facturas.reduce((sum, f) => sum + (f.items?.length || 0), 0), desc: 'Detalle ítems en alquiler' },
    { name: 'ABONO_CLIENTE', rows: appState.abonos.length, desc: 'Historial de abonos a saldo' },
    { name: 'depositoentregado', rows: appState.depositosEntregados.length, desc: 'Reembolsos de depósito' },
    { name: 'gastos', rows: appState.gastos.length, desc: 'Salidas de caja' },
    { name: 'Empresa', rows: 1, desc: 'Configuración datos tienda' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-heading">
              SINCRONIZACIÓN Y EXPORTACIÓN POSTGRESQL
            </h2>
            <p className="text-xs text-slate-400">
              Compatibilidad directa 100% con la base de datos PostgreSQL del análisis WinDev (CLIENTES.wda)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
            {copied ? '¡COPIADO!' : 'COPIAR SCRIPT SQL'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> DESCARGAR ARCHIVO .SQL
          </button>
        </div>
      </div>

      {/* TABLES STATUS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {tables.map((t, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold font-mono text-emerald-400 flex items-center gap-1">
                <Table className="w-3.5 h-3.5" /> {t.name}
              </span>
              <span className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded font-bold text-[10px]">
                {t.rows} reg.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* SQL PREVIEW EDITOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Terminal className="w-4 h-4" /> SCRIPT SQL DUMP COMPATIBLE CON POSTGRESQL:
          </span>
          <span className="text-[10px] text-slate-500 font-mono">PostgreSQL 12+ Script</span>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
          {sqlDump}
        </pre>
      </div>
    </div>
  );
};
