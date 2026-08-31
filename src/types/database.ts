export interface Articulo {
  IDARTICULO: number;
  DESCRIPCION: string;
  TALLA: string;
  STOCK: number;
  VALOR: number; // Valor Alquiler
  CODBARRAS: string;
  IDCAMPOFACTURA?: number;
  VALORDEPOSITO: number; // Valor Depósito de Seguridad
  // Campos visuales y de estado operativo
  ESTADO?: 'Disponible' | 'Alquilado' | 'En Mantenimiento' | 'Reservado';
  CATEGORIA?: string;
  IMAGEN?: string;
}

export interface Cliente {
  IDCLIENTES: number;
  CEDULA: number;
  DIRECCION: string;
  TELEFONO: string;
  TELEFONO2?: string;
  EMPRESA?: string;
  DIRECCIONEMP?: string;
  NOMBRE: string;
  SALDO: number;
  NOTA?: string;
}

export interface CampoFactura {
  AUTOMATIC: number;
  DESCRIPCION: string;
  CANTIDAD: number;
  VALOR: number; // Valor alquiler unitario
  TOTAL: number; // Subtotal alquiler + deposito
  BARRAS: string;
  NUMEROFACT: string;
  IDFACTURA: number;
  VALORDEPOSITO: number; // Deposito unitario
  TOTALALQUILER: number;
  TOTALDEPOSITO: number;
}

export interface Factura {
  IDFACTURA: number;
  NUMEROFACT: string;
  FECHASALIDA: string; // ISO format date (YYYY-MM-DD)
  FECHAENTRADA: string; // ISO format date (YYYY-MM-DD)
  FTOTALDEPOSITO: number;
  FTOTALVENTADEPOSITO: number;
  FORMAPAGO: string;
  MODO: string; // Ej: 'PUNTO DE VENTA', 'APARTADO'
  VENDEDOR: string;
  CCLIENTE: string; // Nombre del cliente
  CCEDULA: string;
  CDIRECCION: string;
  CTELEFONO: string;
  CTELEFONO1?: string;
  CEMPRESA?: string;
  CAMBIOS: number; // Su cambio es...
  PAGACON: number; // Suma abonada/pagada
  AUTOMATIC?: number;
  IDFCLIENTES?: number;
  ESTADOCLIENTE: string; // Ej: 'PENDIENTE DEVOLUCION', 'ENTREGADO', 'DEVUELTO'
  IDF_PAGO?: number;
  GASTOS?: string;
  PAGOCONEFECTIVO: number;
  PAGOCONTRANFERENCIA: number;
  FTOTALALQUILER: number;
  FPAGOTRANS?: string;
  DESCUENTO: number;
  P_SALDO_EFECTIVO?: number;
  P_SALDO_TRANFERENCIA?: number;
  TOTAL_SALDO: number;
  FECHA_RECIBO?: string;
  SALDOA_BONADO?: number;
  FECHAINGRESO?: string;
  // Detalle de articulos cargados
  items?: CampoFactura[];
}

export interface AbonoCliente {
  IDABONO_CLIENTE: number;
  NUMEROABONO: string;
  ACLIENTE: string;
  AFACTURA: string;
  PAGOEFECTIVO: number;
  PAGOTRANFE: number;
  FECHAABONO: string;
  SALDOANTERIOR: number;
  SALDODEBER: number;
  TOTAL_ABONO: number;
}

export interface DepositoEntregado {
  IDdepositoentregado: number;
  NUMEROFACTURA: string;
  VALOR: number;
  FECHA: string;
}

export interface Gasto {
  IDgastos: number;
  NUMEROGASTO: string;
  DESCRIPCIONSALIDA: string;
  FECHA: string;
  VALORSALIDA: number;
}

export interface Caja {
  IDCAJAS: number;
  NOMBRECAJA: string;
  RESOLUCION: string;
  NUMERACION: number;
  PREFIJO: string;
}

export interface Empresa {
  IDEmpresa: number;
  RAZOSOCIAL: string;
  ENOMBRE: string;
  NIT: string;
  ETIPO: string;
  EDIRECCION: string;
  ETELEFONO: string;
  EMAIL: string;
  WEB: string;
  SERIE: string;
  LOGO?: string;
  MENSAJE: string;
}

export interface Usuario {
  IDLOGIN: number;
  INOMBRE: string;
  IAPELLIDO: string;
  ILOGIN: number;
  PASSWORD?: string;
  TIPO: boolean;
  ACCESOALMENU: boolean;
}

export interface ReservaApartado {
  ID: number;
  NUMERORESERVA: string;
  CLIENTE_NOMBRE: string;
  CLIENTE_CEDULA: string;
  FECHA_EVENTO: string;
  ABONO_INICIAL: number;
  TOTAL: number;
  ESTADO: 'ACTIVA' | 'CANCELADA' | 'COMPLETADA';
  ITEMS_DESCRIPCION: string;
}
