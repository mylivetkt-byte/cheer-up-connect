import React from 'react';
import {
  ShoppingBag,
  RotateCcw,
  Shirt,
  Users,
  DollarSign,
  Calendar,
  Database,
  Building2,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Empresa, Usuario, Caja } from '../types/database';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  empresa: Empresa;
  usuario: Usuario;
  caja: Caja;
  onOpenGastoModal: () => void;
  onOpenAbonoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  empresa,
  usuario,
  caja,
  onOpenGastoModal,
  onOpenAbonoModal
}) => {
  const tabs = [
    { id: 'pos', label: 'PUNTO DE VENTA', icon: ShoppingBag, color: 'from-rose-500 to-red-600' },
    { id: 'devoluciones', label: 'ENTRADA VESTIDO', icon: RotateCcw, color: 'from-emerald-500 to-teal-600' },
    { id: 'articulos', label: 'ARTÍCULOS / TRAJES', icon: Shirt, color: 'from-blue-500 to-indigo-600' },
    { id: 'clientes', label: 'CLIENTES & ABONOS', icon: Users, color: 'from-purple-500 to-pink-600' },
    { id: 'gastos', label: 'CAJA & GASTOS', icon: DollarSign, color: 'from-amber-500 to-orange-600' },
    { id: 'apartados', label: 'APARTADOS', icon: Calendar, color: 'from-cyan-500 to-blue-600' },
    { id: 'sync', label: 'POSTGRESQL', icon: Database, color: 'from-slate-600 to-slate-800' },
    { id: 'empresa', label: 'EMPRESA', icon: Building2, color: 'from-slate-700 to-slate-900' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-heading">
              {empresa.ENOMBRE}
            </h1>
            <p className="text-xs text-rose-400 font-medium">
              {empresa.MENSAJE || 'Para toda ocasión sin importar tu edad'}
            </p>
          </div>
        </div>

        {/* Info Right */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">CAJERO</span>
              <span className="font-semibold text-slate-200">{usuario.INOMBRE} {usuario.IAPELLIDO}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">CAJA</span>
              <span className="font-semibold text-slate-200">{caja.NOMBRECAJA}</span>
            </div>
          </div>

          <button
            onClick={onOpenGastoModal}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            GASTO (SALIDA)
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <nav className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-rose-900/30 ring-1 ring-white/20 scale-[1.02]`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
