import React, { useState, useEffect } from 'react';
import { loadAppState, saveAppState, AppState } from './services/store';
import { Factura, Articulo, Cliente, AbonoCliente, Gasto, Empresa, ReservaApartado } from './types/database';

import { Navbar } from './components/Navbar';
import { POSView } from './components/POSView';
import { ReturnVestidoModal } from './components/ReturnVestidoModal';
import { ArticlesView } from './components/ArticlesView';
import { ClientsView } from './components/ClientsView';
import { AbonosModal } from './components/AbonosModal';
import { ExpensesModal } from './components/ExpensesModal';
import { ApartadosView } from './components/ApartadosView';
import { ReceiptModal } from './components/ReceiptModal';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { PostgresSyncModal } from './components/PostgresSyncModal';

export function App() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [activeTab, setActiveTab] = useState<string>('pos');

  // Modales
  const [showEntradaVestidoModal, setShowEntradaVestidoModal] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [selectedClienteAbono, setSelectedClienteAbono] = useState<Cliente | null>(null);
  const [selectedPrintFactura, setSelectedPrintFactura] = useState<Factura | null>(null);

  // Guardar automáticamente en localStorage cuando appState cambie
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Manejadores de Estado
  const handleCompletarAlquiler = (nuevaFactura: Factura) => {
    // 1. Agregar factura
    const updatedFacturas = [nuevaFactura, ...appState.facturas];

    // 2. Descontar stock y cambiar estado de prendas a 'Alquilado'
    const itemBarcodes = nuevaFactura.items?.map(it => it.BARRAS) || [];
    const updatedArticulos = appState.articulos.map(art => {
      if (itemBarcodes.includes(art.CODBARRAS)) {
        return {
          ...art,
          STOCK: Math.max(0, art.STOCK - 1),
          ESTADO: 'Alquilado' as const
        };
      }
      return art;
    });

    setAppState(prev => ({
      ...prev,
      facturas: updatedFacturas,
      articulos: updatedArticulos
    }));
  };

  const handleProcesarDevolucion = (numeroFactura: string, valorDepositoDevuelto: number) => {
    // 1. Actualizar estado de factura
    const targetFactura = appState.facturas.find(f => f.NUMEROFACT === numeroFactura);
    const updatedFacturas = appState.facturas.map(f => {
      if (f.NUMEROFACT === numeroFactura) {
        return {
          ...f,
          ESTADOCLIENTE: 'DEVUELTO Y DEPÓSITO ENTREGADO'
        };
      }
      return f;
    });

    // 2. Crear registro depositoentregado
    const nuevoDeposito = {
      IDdepositoentregado: Date.now(),
      NUMEROFACTURA: numeroFactura,
      VALOR: valorDepositoDevuelto,
      FECHA: new Date().toISOString().split('T')[0]
    };

    // 3. Restaurar stock y cambiar estado de prendas a 'Disponible'
    const targetBarcodes = targetFactura?.items?.map(i => i.BARRAS) || [];
    const updatedArticulos = appState.articulos.map(art => {
      if (targetBarcodes.includes(art.CODBARRAS)) {
        return {
          ...art,
          STOCK: art.STOCK + 1,
          ESTADO: 'Disponible' as const
        };
      }
      return art;
    });

    setAppState(prev => ({
      ...prev,
      facturas: updatedFacturas,
      depositosEntregados: [nuevoDeposito, ...prev.depositosEntregados],
      articulos: updatedArticulos
    }));
  };

  const handleSaveArticulo = (art: Articulo) => {
    const exists = appState.articulos.some(a => a.IDARTICULO === art.IDARTICULO);
    const updatedArticulos = exists
      ? appState.articulos.map(a => (a.IDARTICULO === art.IDARTICULO ? art : a))
      : [art, ...appState.articulos];

    setAppState(prev => ({ ...prev, articulos: updatedArticulos }));
  };

  const handleDeleteArticulo = (id: number) => {
    setAppState(prev => ({
      ...prev,
      articulos: prev.articulos.filter(a => a.IDARTICULO !== id)
    }));
  };

  const handleSaveCliente = (cliente: Cliente) => {
    const exists = appState.clientes.some(c => c.IDCLIENTES === cliente.IDCLIENTES);
    const updatedClientes = exists
      ? appState.clientes.map(c => (c.IDCLIENTES === cliente.IDCLIENTES ? cliente : c))
      : [cliente, ...appState.clientes];

    setAppState(prev => ({ ...prev, clientes: updatedClientes }));
  };

  const handleGuardarAbono = (abono: AbonoCliente) => {
    const updatedAbonos = [abono, ...appState.abonos];

    // Descontar saldo del cliente
    const updatedClientes = appState.clientes.map(c => {
      if (c.NOMBRE === abono.ACLIENTE) {
        return {
          ...c,
          SALDO: abono.SALDODEBER
        };
      }
      return c;
    });

    setAppState(prev => ({
      ...prev,
      abonos: updatedAbonos,
      clientes: updatedClientes
    }));
  };

  const handleAgregarGasto = (gasto: Gasto) => {
    setAppState(prev => ({
      ...prev,
      gastos: [gasto, ...prev.gastos]
    }));
  };

  const handleAgregarApartado = (apartado: ReservaApartado) => {
    setAppState(prev => ({
      ...prev,
      apartados: [apartado, ...prev.apartados]
    }));
  };

  const handleSaveEmpresa = (nuevaEmpresa: Empresa) => {
    setAppState(prev => ({
      ...prev,
      empresa: nuevaEmpresa
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* NAVBAR TRASLÚCIDA */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        empresa={appState.empresa}
        usuario={appState.usuario}
        caja={appState.caja}
        onOpenGastoModal={() => setShowGastoModal(true)}
        onOpenAbonoModal={() => setSelectedClienteAbono(appState.clientes[0] || null)}
      />

      {/* CONTENIDO PRINCIPAL POR PESTAÑA */}
      <main className="flex-1 pb-10">
        {activeTab === 'pos' && (
          <POSView
            articulos={appState.articulos}
            clientes={appState.clientes}
            facturas={appState.facturas}
            onCompletarAlquiler={handleCompletarAlquiler}
            onOpenEntradaVestido={() => setShowEntradaVestidoModal(true)}
            onOpenGastoModal={() => setShowGastoModal(true)}
            onNavigateToApartados={() => setActiveTab('apartados')}
            onPrintFactura={(fact) => setSelectedPrintFactura(fact)}
          />
        )}

        {activeTab === 'devoluciones' && (
          <div className="p-4">
            <ReturnVestidoModal
              facturas={appState.facturas}
              onClose={() => setActiveTab('pos')}
              onProcesarDevolucion={handleProcesarDevolucion}
            />
          </div>
        )}

        {activeTab === 'articulos' && (
          <ArticlesView
            articulos={appState.articulos}
            onSaveArticulo={handleSaveArticulo}
            onDeleteArticulo={handleDeleteArticulo}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientsView
            clientes={appState.clientes}
            onSaveCliente={handleSaveCliente}
            onOpenAbonoModal={(cliente) => setSelectedClienteAbono(cliente)}
          />
        )}

        {activeTab === 'gastos' && (
          <div className="p-4">
            <ExpensesModal
              gastos={appState.gastos}
              onClose={() => setActiveTab('pos')}
              onAgregarGasto={handleAgregarGasto}
            />
          </div>
        )}

        {activeTab === 'apartados' && (
          <ApartadosView
            apartados={appState.apartados}
            onAgregarApartado={handleAgregarApartado}
          />
        )}

        {activeTab === 'sync' && (
          <PostgresSyncModal
            appState={appState}
            onClose={() => setActiveTab('pos')}
          />
        )}

        {activeTab === 'empresa' && (
          <CompanySettingsModal
            empresa={appState.empresa}
            onSave={handleSaveEmpresa}
            onClose={() => setActiveTab('pos')}
          />
        )}
      </main>

      {/* MODALES FLOTANTES */}
      {showEntradaVestidoModal && (
        <ReturnVestidoModal
          facturas={appState.facturas}
          onClose={() => setShowEntradaVestidoModal(false)}
          onProcesarDevolucion={handleProcesarDevolucion}
        />
      )}

      {showGastoModal && (
        <ExpensesModal
          gastos={appState.gastos}
          onClose={() => setShowGastoModal(false)}
          onAgregarGasto={handleAgregarGasto}
        />
      )}

      {selectedClienteAbono && (
        <AbonosModal
          cliente={selectedClienteAbono}
          onClose={() => setSelectedClienteAbono(null)}
          onGuardarAbono={handleGuardarAbono}
        />
      )}

      {selectedPrintFactura && (
        <ReceiptModal
          factura={selectedPrintFactura}
          empresa={appState.empresa}
          onClose={() => setSelectedPrintFactura(null)}
        />
      )}
    </div>
  );
}
