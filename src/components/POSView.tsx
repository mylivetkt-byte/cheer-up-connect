import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  UserCheck,
  PlusCircle,
  Printer,
  Trash2,
  CheckCircle2,
  Sparkles,
  Barcode,
  Calendar,
  XCircle,
  Tag,
  DollarSign
} from 'lucide-react';
import { Articulo, Cliente, Factura, CampoFactura } from '../types/database';
import { formatCurrency } from '../services/store';

interface POSViewProps {
  articulos: Articulo[];
  clientes: Cliente[];
  facturas: Factura[];
  onCompletarAlquiler: (nuevaFactura: Factura) => void;
  onOpenEntradaVestido: () => void;
  onOpenGastoModal: () => void;
  onNavigateToApartados: () => void;
  onPrintFactura: (factura: Factura) => void;
}

export const POSView: React.FC<POSViewProps> = ({
  articulos,
  clientes,
  facturas,
  onCompletarAlquiler,
  onOpenEntradaVestido,
  onOpenGastoModal,
  onNavigateToApartados,
  onPrintFactura
}) => {
  // Datos del Cliente seleccionado
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(clientes[0] || null);
  const [cedulaInput, setCedulaInput] = useState(clientes[0]?.CEDULA.toString() || '');
  const [nombreInput, setNombreInput] = useState(clientes[0]?.NOMBRE || '');
  const [direccionInput, setDireccionInput] = useState(clientes[0]?.DIRECCION || '');
  const [telefonoInput, setTelefonoInput] = useState(clientes[0]?.TELEFONO || '');

  // Fechas del Alquiler
  const todayStr = new Date().toISOString().split('T')[0];
  const inThreeDaysStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [fechaSalida, setFechaSalida] = useState(todayStr);
  const [fechaEntrada, setFechaEntrada] = useState(inThreeDaysStr);

  // Traje Estado
  const [estadoTraje, setEstadoTraje] = useState('DISPONIBLE');

  // Selección de Artículo para agregar
  const [selectedArticuloId, setSelectedArticuloId] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState<number>(1);

  // Items en la Factura/Alquiler actual
  const [cartItems, setCartItems] = useState<CampoFactura[]>([]);

  // Pagos en el Panel Derecho
  const [pagoEfectivo, setPagoEfectivo] = useState<number>(0);
  const [pagoTransferencia, setPagoTransferencia] = useState<number>(0);
  const [descuentoAlquiler, setDescuentoAlquiler] = useState<number>(0);

  // Modales
  const [showBuscarClienteModal, setShowBuscarClienteModal] = useState(false);
  const [showNuevoClienteModal, setShowNuevoClienteModal] = useState(false);
  const [clienteSearchTerm, setClienteSearchTerm] = useState('');

  // Siguiente Número de Recibo
  const nextReciboNum = useMemo(() => {
    const count = facturas.length + 1041;
    return `REC-${count}`;
  }, [facturas]);

  // Cálculos de Totales
  const totalDeposito = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.TOTALDEPOSITO, 0);
  }, [cartItems]);

  const totalAlquilerBruto = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.TOTALALQUILER, 0);
  }, [cartItems]);

  const totalAlquilerNeto = useMemo(() => {
    return Math.max(0, totalAlquilerBruto - descuentoAlquiler);
  }, [totalAlquilerBruto, descuentoAlquiler]);

  const totalGranTotal = useMemo(() => {
    return totalDeposito + totalAlquilerNeto;
  }, [totalDeposito, totalAlquilerNeto]);

  const totalPagado = useMemo(() => {
    return (pagoEfectivo || 0) + (pagoTransferencia || 0);
  }, [pagoEfectivo, pagoTransferencia]);

  const suCambio = useMemo(() => {
    return Math.max(0, totalPagado - totalGranTotal);
  }, [totalPagado, totalGranTotal]);

  // Manejadores
  const handleSelectCliente = (c: Cliente) => {
    setSelectedCliente(c);
    setCedulaInput(c.CEDULA.toString());
    setNombreInput(c.NOMBRE);
    setDireccionInput(c.DIRECCION);
    setTelefonoInput(c.TELEFONO);
    setShowBuscarClienteModal(false);
  };

  const handleBuscarCedulaBlur = () => {
    if (!cedulaInput) return;
    const found = clientes.find(c => c.CEDULA.toString() === cedulaInput.trim());
    if (found) {
      handleSelectCliente(found);
    }
  };

  const handleAddArticulo = () => {
    let art: Articulo | undefined;
    if (barcodeInput.trim()) {
      art = articulos.find(a => a.CODBARRAS === barcodeInput.trim());
    } else if (selectedArticuloId) {
      art = articulos.find(a => a.IDARTICULO.toString() === selectedArticuloId);
    }

    if (!art) {
      alert('Seleccione o ingrese el código de un artículo válido.');
      return;
    }

    const qty = Math.max(1, cantidadInput);
    const valAlquiler = art.VALOR;
    const valDeposito = art.VALORDEPOSITO;
    const totAlquiler = valAlquiler * qty;
    const totDeposito = valDeposito * qty;
    const itemTotal = totAlquiler + totDeposito;

    const newItem: CampoFactura = {
      AUTOMATIC: Date.now() + Math.floor(Math.random() * 1000),
      DESCRIPCION: `${art.DESCRIPCION} (Talla: ${art.TALLA})`,
      CANTIDAD: qty,
      VALOR: valAlquiler,
      TOTAL: itemTotal,
      BARRAS: art.CODBARRAS,
      NUMEROFACT: nextReciboNum,
      IDFACTURA: 0,
      VALORDEPOSITO: valDeposito,
      TOTALALQUILER: totAlquiler,
      TOTALDEPOSITO: totDeposito
    };

    setCartItems(prev => [...prev, newItem]);

    // Autocompletar pago en efectivo si está en 0
    const newGranTotal = totalGranTotal + itemTotal;
    setPagoEfectivo(newGranTotal);

    // Reset inputs
    setBarcodeInput('');
    setSelectedArticuloId('');
    setCantidadInput(1);
  };

  const handleRemoveItem = (automaticId: number) => {
    setCartItems(prev => prev.filter(i => i.AUTOMATIC !== automaticId));
  };

  const handleResetForm = () => {
    setCartItems([]);
    setPagoEfectivo(0);
    setPagoTransferencia(0);
    setDescuentoAlquiler(0);
    setBarcodeInput('');
    setSelectedArticuloId('');
  };

  const handlePagar = () => {
    if (cartItems.length === 0) {
      alert('Debe agregar al menos un artículo para realizar el alquiler.');
      return;
    }
    if (!nombreInput.trim()) {
      alert('Por favor ingrese los datos del cliente.');
      return;
    }
    if (totalPagado < totalGranTotal) {
      const resp = confirm(
        `El valor pagado (${formatCurrency(totalPagado)}) es menor al total (${formatCurrency(totalGranTotal)}).\n¿Desea registrar como alquiler con saldo pendiente?`
      );
      if (!resp) return;
    }

    const nuevaFactura: Factura = {
      IDFACTURA: Date.now(),
      NUMEROFACT: nextReciboNum,
      FECHASALIDA: fechaSalida,
      FECHAENTRADA: fechaEntrada,
      FTOTALDEPOSITO: totalDeposito,
      FTOTALVENTADEPOSITO: 0,
      FORMAPAGO: pagoTransferencia > 0 ? (pagoEfectivo > 0 ? 'MIXTO' : 'TRANSFERENCIA') : 'EFECTIVO',
      MODO: 'PUNTO DE VENTA',
      VENDEDOR: 'Carlos Mendoza',
      CCLIENTE: nombreInput,
      CCEDULA: cedulaInput,
      CDIRECCION: direccionInput,
      CTELEFONO: telefonoInput,
      CAMBIOS: suCambio,
      PAGACON: totalPagado,
      ESTADOCLIENTE: 'PENDIENTE DEVOLUCION',
      PAGOCONEFECTIVO: pagoEfectivo,
      PAGOCONTRANFERENCIA: pagoTransferencia,
      FTOTALALQUILER: totalAlquilerNeto,
      DESCUENTO: descuentoAlquiler,
      TOTAL_SALDO: Math.max(0, totalGranTotal - totalPagado),
      items: cartItems
    };

    onCompletarAlquiler(nuevaFactura);
    onPrintFactura(nuevaFactura);
    handleResetForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* HEADER POS BAR - FIJA INSPIRADA EN WINDEV POS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              PUNTO DE VENTA
            </span>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>FECHA: <strong className="text-slate-200">{todayStr}</strong></span>
            </div>
            <div className="text-xs text-slate-400">
              N. RECIBO: <strong className="text-rose-400 font-mono text-sm">{nextReciboNum}</strong>
            </div>
          </div>

          <div className="text-xl font-black bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 bg-clip-text text-transparent font-heading">
            LA CASA DEL DISFRAZ
          </div>
        </div>

        {/* DATOS DEL CLIENTE Y FECHAS DE ALQUILER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
          {/* Datos Cliente (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
              <span className="flex items-center gap-1 text-rose-400">
                <UserCheck className="w-4 h-4" /> INFORMACIÓN DEL CLIENTE
              </span>
              <button
                onClick={() => setShowBuscarClienteModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
              >
                <Search className="w-3 h-3" /> Buscar Existente
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">CÉDULA / NIT</label>
                <input
                  type="text"
                  value={cedulaInput}
                  onChange={e => setCedulaInput(e.target.value)}
                  onBlur={handleBuscarCedulaBlur}
                  placeholder="Cédula obligatoria"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-medium text-xs outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 mb-0.5">NOMBRE COMPLETO</label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={e => setNombreInput(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-lg px-2.5 py-1.5 text-slate-100 font-medium text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">DIRECCIÓN</label>
                <input
                  type="text"
                  value={direccionInput}
                  onChange={e => setDireccionInput(e.target.value)}
                  placeholder="Dirección de entrega"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">TELÉFONO</label>
                <input
                  type="text"
                  value={telefonoInput}
                  onChange={e => setTelefonoInput(e.target.value)}
                  placeholder="Teléfono móvil / WhatsApp"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fechas y Estado (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1 text-emerald-400">
              <Calendar className="w-4 h-4" /> FECHAS Y ESTADO DEL TRAJE
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">FECHA SALIDA</label>
                <input
                  type="date"
                  value={fechaSalida}
                  onChange={e => setFechaSalida(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2 py-1.5 text-slate-100 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">FECHA ENTRADA</label>
                <input
                  type="date"
                  value={fechaEntrada}
                  onChange={e => setFechaEntrada(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2 py-1.5 text-slate-100 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">ESTADO TRAJE</label>
              <select
                value={estadoTraje}
                onChange={e => setEstadoTraje(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold text-xs outline-none"
              >
                <option value="DISPONIBLE">DISPONIBLE PARA SALIDA</option>
                <option value="ALQUILADO">ALQUILADO EN USO</option>
                <option value="RESERVADO">RESERVADO APARTADO</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS TOOLBAR - MATCHING WINDEV BAR */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowNuevoClienteModal(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> NUEVO CLIENTE
          </button>

          <button
            onClick={() => setShowBuscarClienteModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-bold text-xs transition flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" /> BUSCAR CLIENTE
          </button>

          <button
            onClick={handleResetForm}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-bold text-xs transition flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> NUEVO ALQUILER
          </button>

          <button
            onClick={onOpenGastoModal}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs transition flex items-center gap-1"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" /> GASTO (SALIDA)
          </button>

          <button
            onClick={() => facturas.length > 0 && onPrintFactura(facturas[facturas.length - 1])}
            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg font-bold text-xs transition flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" /> REIMPRIMIR
          </button>

          <button
            onClick={onNavigateToApartados}
            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold text-xs transition flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5 text-cyan-400" /> APARTADOS
          </button>

          <button
            onClick={onOpenEntradaVestido}
            className="ml-auto px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-extrabold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 animate-pulse"
          >
            <Sparkles className="w-4 h-4" /> ENTRADA VESTIDO (DEVOLUCIÓN)
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL: POS TABLE & RIGHT PAYMENT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUMNA IZQUIERDA: BUSCADOR DE ARTÍCULOS Y TABLA (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          {/* BARRA DE SELECCIÓN DE ARTÍCULO */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-md flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] text-slate-400 mb-0.5">ARTÍCULO / DISFRAZ</label>
              <select
                value={selectedArticuloId}
                onChange={e => {
                  setSelectedArticuloId(e.target.value);
                  setBarcodeInput('');
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg px-3 py-2 text-slate-100 font-medium text-xs outline-none"
              >
                <option value="">-- Seleccionar traje del catálogo --</option>
                {articulos.map(art => (
                  <option key={art.IDARTICULO} value={art.IDARTICULO.toString()}>
                    {art.DESCRIPCION} (Talla: {art.TALLA}) - Alquiler: {formatCurrency(art.VALOR)} | Depósito: {formatCurrency(art.VALORDEPOSITO)} (Stock: {art.STOCK})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-36">
              <label className="block text-[10px] text-slate-400 mb-0.5">CÓD. BARRAS</label>
              <div className="relative">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={e => {
                    setBarcodeInput(e.target.value);
                    setSelectedArticuloId('');
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleAddArticulo()}
                  placeholder="Escanear..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg pl-8 pr-2.5 py-2 text-slate-100 text-xs font-mono outline-none"
                />
                <Barcode className="w-4 h-4 text-slate-500 absolute left-2 top-2.5" />
              </div>
            </div>

            <div className="w-20">
              <label className="block text-[10px] text-slate-400 mb-0.5">CANTIDAD</label>
              <input
                type="number"
                min="1"
                value={cantidadInput}
                onChange={e => setCantidadInput(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg px-2.5 py-2 text-center text-slate-100 font-bold text-xs outline-none"
              />
            </div>

            <button
              onClick={handleAddArticulo}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> AGREGAR
            </button>
          </div>

          {/* TABLA DE PRENDAS AGREGADAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-[360px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-3">DESCRIPCIÓN</th>
                    <th className="px-3 py-3 text-center">CANTIDAD</th>
                    <th className="px-3 py-3 text-right">VALOR ALQUILER</th>
                    <th className="px-3 py-3 text-right">TOTAL ALQUILER</th>
                    <th className="px-3 py-3 text-right">DEPÓSITO</th>
                    <th className="px-3 py-3 text-right">TOTAL DEPÓSITO</th>
                    <th className="px-3 py-3 text-right text-rose-400">TOT ALQUILER+DEP</th>
                    <th className="px-3 py-3 text-center">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                        <Shirt className="w-12 h-12 mx-auto mb-2 text-slate-600 opacity-50 animate-bounce" />
                        <p className="text-sm font-semibold">No se han agregado trajes o disfraces a esta orden</p>
                        <p className="text-xs text-slate-600">Seleccione un traje de la lista o escanee su código de barras</p>
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item) => (
                      <tr key={item.AUTOMATIC} className="hover:bg-slate-800/40 transition">
                        <td className="px-3 py-3 font-semibold text-slate-100">{item.DESCRIPCION}</td>
                        <td className="px-3 py-3 text-center font-bold text-rose-300">{item.CANTIDAD}</td>
                        <td className="px-3 py-3 text-right text-slate-300">{formatCurrency(item.VALOR)}</td>
                        <td className="px-3 py-3 text-right text-emerald-400 font-bold">{formatCurrency(item.TOTALALQUILER)}</td>
                        <td className="px-3 py-3 text-right text-slate-300">{formatCurrency(item.VALORDEPOSITO)}</td>
                        <td className="px-3 py-3 text-right text-blue-400 font-bold">{formatCurrency(item.TOTALDEPOSITO)}</td>
                        <td className="px-3 py-3 text-right font-black text-white bg-slate-800/50">{formatCurrency(item.TOTAL)}</td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.AUTOMATIC)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                            title="Eliminar ítem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* BARRA INFERIOR DE TOTALES RÁPIDOS */}
            <div className="bg-slate-950 p-3 border-t border-slate-800 flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-400">TOTAL ARTÍCULOS: <strong className="text-white">{cartItems.length}</strong></span>
              <div className="flex gap-4">
                <span className="text-slate-400">ALQUILER: <strong className="text-emerald-400">{formatCurrency(totalAlquilerNeto)}</strong></span>
                <span className="text-slate-400">DEPÓSITO: <strong className="text-blue-400">{formatCurrency(totalDeposito)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE PAGOS AZUL ESTILO WINDEV (4 COLS) */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-b from-sky-900/90 via-blue-950 to-slate-950 border border-sky-600/40 rounded-2xl p-4 shadow-2xl space-y-4">
            <h3 className="text-center font-extrabold text-sky-200 tracking-wider text-sm border-b border-sky-700/50 pb-2">
              PANEL DE LIQUIDACIÓN Y PAGO
            </h3>

            {/* PAGA CON EFECTIVO */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-sky-800/60">
              <label className="block text-[11px] font-bold text-sky-300 uppercase mb-1">
                PAGA CON EFECTIVO:
              </label>
              <input
                type="number"
                value={pagoEfectivo || ''}
                onChange={e => setPagoEfectivo(parseFloat(e.target.value) || 0)}
                className="w-full bg-sky-950/90 border border-sky-500 rounded-lg p-2 text-right text-xl font-black font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* PAGA CON TRANSFERENCIA */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-sky-800/60">
              <label className="block text-[11px] font-bold text-sky-300 uppercase mb-1">
                PAGA CON TRANSFERENCIA:
              </label>
              <input
                type="number"
                value={pagoTransferencia || ''}
                onChange={e => setPagoTransferencia(parseFloat(e.target.value) || 0)}
                className="w-full bg-sky-950/90 border border-sky-500 rounded-lg p-2 text-right text-xl font-black font-mono text-cyan-300 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* DESGLOSE TOTALES */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-sky-800/60 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>TOTAL DEPÓSITO:</span>
                <span className="font-extrabold text-blue-400 font-mono text-sm">{formatCurrency(totalDeposito)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>TOTAL ALQUILER:</span>
                <span className="font-extrabold text-emerald-400 font-mono text-sm">{formatCurrency(totalAlquilerBruto)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>DESCUENTO ALQUILER:</span>
                <input
                  type="number"
                  value={descuentoAlquiler || ''}
                  onChange={e => setDescuentoAlquiler(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right font-bold text-rose-400 font-mono outline-none"
                />
              </div>

              <div className="pt-2 border-t border-sky-800/80 flex justify-between items-center">
                <span className="font-extrabold text-white">TOTAL DEPÓSITO + ALQUILER:</span>
                <span className="font-black text-xl text-amber-300 font-mono">{formatCurrency(totalGranTotal)}</span>
              </div>
            </div>

            {/* SU CAMBIO ES (HIGHLIGHTED) */}
            <div className="bg-emerald-950/70 border-2 border-emerald-500/80 p-3 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 tracking-widest uppercase block">
                SU CAMBIO ES:
              </span>
              <div className="text-2xl font-black font-mono text-emerald-200">
                {formatCurrency(suCambio)}
              </div>
            </div>

            {/* BOTÓN PRINCIPAL DE PAGO */}
            <button
              onClick={handlePagar}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black tracking-wider text-sm rounded-xl shadow-xl shadow-emerald-950/60 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> PROCESAR PAGO Y GENERAR RECIBO
            </button>
          </div>
        </div>
      </div>

      {/* MODAL BUSCAR CLIENTE */}
      {showBuscarClienteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400" /> BÚSQUEDA DE CLIENTE
              </h3>
              <button onClick={() => setShowBuscarClienteModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={clienteSearchTerm}
              onChange={e => setClienteSearchTerm(e.target.value)}
              placeholder="Buscar por cédula o nombre..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-rose-500"
            />

            <div className="max-h-60 overflow-y-auto space-y-2">
              {clientes
                .filter(c =>
                  c.NOMBRE.toLowerCase().includes(clienteSearchTerm.toLowerCase()) ||
                  c.CEDULA.toString().includes(clienteSearchTerm)
                )
                .map(c => (
                  <div
                    key={c.IDCLIENTES}
                    onClick={() => handleSelectCliente(c)}
                    className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer transition flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-100">{c.NOMBRE}</div>
                      <div className="text-slate-400 font-mono">Cédula: {c.CEDULA} | Tel: {c.TELEFONO}</div>
                    </div>
                    <span className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded font-bold text-[10px]">
                      SELECCIONAR
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO CLIENTE */}
      {showNuevoClienteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" /> REGISTRAR NUEVO CLIENTE
              </h3>
              <button onClick={() => setShowNuevoClienteModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">CÉDULA / NIT *</label>
                <input
                  type="text"
                  value={cedulaInput}
                  onChange={e => setCedulaInput(e.target.value)}
                  placeholder="Número de cédula"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">NOMBRE COMPLETO *</label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={e => setNombreInput(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DIRECCIÓN DE RESIDENCIA</label>
                <input
                  type="text"
                  value={direccionInput}
                  onChange={e => setDireccionInput(e.target.value)}
                  placeholder="Calle / Carrera"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TELÉFONO / CELULAR</label>
                <input
                  type="text"
                  value={telefonoInput}
                  onChange={e => setTelefonoInput(e.target.value)}
                  placeholder="300 000 0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowNuevoClienteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
              >
                CANCELAR
              </button>
              <button
                onClick={() => setShowNuevoClienteModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                GUARDAR Y SELECCIONAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
