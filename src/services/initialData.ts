import { Articulo, Cliente, Factura, Gasto, Empresa, Caja, Usuario } from '../types/database';

export const initialEmpresa: Empresa = {
  IDEmpresa: 1,
  RAZOSOCIAL: 'LA CASA DEL DISFRAZ S.A.S.',
  ENOMBRE: 'La Casa Del Disfraz',
  NIT: '900.876.543-1',
  ETIPO: 'PUNTO DE VENTA Y ALQUILER',
  EDIRECCION: 'Carrera 15 # 45-28, Centro',
  ETELEFONO: '3104567890',
  EMAIL: 'contacto@lacasadeldisfraz.com',
  WEB: 'www.lacasadeldisfraz.com',
  SERIE: 'LCD-2026',
  MENSAJE: '¡Para toda ocasión sin importar tu edad! Conserve su recibo.'
};

export const initialCaja: Caja = {
  IDCAJAS: 1,
  NOMBRECAJA: 'CAJA PRINCIPAL 01',
  RESOLUCION: '18764009872',
  NUMERACION: 1042,
  PREFIJO: 'REC-'
};

export const initialUsuario: Usuario = {
  IDLOGIN: 1,
  INOMBRE: 'Carlos',
  IAPELLIDO: 'Mendoza',
  ILOGIN: 101,
  TIPO: true,
  ACCESOALMENU: true
};

export const initialArticulos: Articulo[] = [
  {
    IDARTICULO: 1,
    DESCRIPCION: 'Disfraz Spiderman Adulto Premium',
    TALLA: 'L',
    STOCK: 4,
    VALOR: 60000,
    CODBARRAS: '7701001001',
    VALORDEPOSITO: 50000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Superhéroes',
    IMAGEN: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 2,
    DESCRIPCION: 'Traje de Gala Tuxedo Negro Elegante',
    TALLA: 'M',
    STOCK: 3,
    VALOR: 95000,
    CODBARRAS: '7701001002',
    VALORDEPOSITO: 80000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Gala & Eventos',
    IMAGEN: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 3,
    DESCRIPCION: 'Disfraz Blanca Nieves Princesa Real',
    TALLA: 'S',
    STOCK: 2,
    VALOR: 55000,
    CODBARRAS: '7701001003',
    VALORDEPOSITO: 45000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Princesas & Fantasía',
    IMAGEN: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 4,
    DESCRIPCION: 'Traje Mariachi Tradicional Bordado Dorado',
    TALLA: 'XL',
    STOCK: 2,
    VALOR: 80000,
    CODBARRAS: '7701001004',
    VALORDEPOSITO: 70000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Típicos & Folclor',
    IMAGEN: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 5,
    DESCRIPCION: 'Disfraz Pirata del Caribe con Sombrero y Espada',
    TALLA: 'M',
    STOCK: 5,
    VALOR: 50000,
    CODBARRAS: '7701001005',
    VALORDEPOSITO: 40000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Fantasía',
    IMAGEN: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 6,
    DESCRIPCION: 'Disfraz Astronauta NASA Infantil',
    TALLA: '10-12',
    STOCK: 3,
    VALOR: 45000,
    CODBARRAS: '7701001006',
    VALORDEPOSITO: 35000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Infantil',
    IMAGEN: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=60'
  },
  {
    IDARTICULO: 7,
    DESCRIPCION: 'Vestido de Época Victoriana Real Lux',
    TALLA: 'M',
    STOCK: 1,
    VALOR: 110000,
    CODBARRAS: '7701001007',
    VALORDEPOSITO: 100000,
    ESTADO: 'Disponible',
    CATEGORIA: 'Época & Teatral',
    IMAGEN: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60'
  }
];

export const initialClientes: Cliente[] = [
  {
    IDCLIENTES: 1,
    CEDULA: 1018293847,
    NOMBRE: 'Ana María Rodríguez',
    DIRECCION: 'Calle 72 # 11-45 Apto 302',
    TELEFONO: '3159876543',
    TELEFONO2: '3001234567',
    EMPRESA: 'Teatro Nacional',
    DIRECCIONEMP: 'Calle 71 # 10-20',
    SALDO: 0,
    NOTA: 'Cliente frecuente de disfraces teatrales.'
  },
  {
    IDCLIENTES: 2,
    CEDULA: 801928374,
    NOMBRE: 'Jorge Enrique Gómez',
    DIRECCION: 'Av. Las Américas # 34-12',
    TELEFONO: '3187654321',
    TELEFONO2: '6014567890',
    EMPRESA: 'Eventos & Producciones SAS',
    DIRECCIONEMP: 'Cra 68 # 20-05',
    SALDO: 0,
    NOTA: 'Paga con preferencia por transferencia Nequi/Bancolombia.'
  },
  {
    IDCLIENTES: 3,
    CEDULA: 52938475,
    NOMBRE: 'Laura Sofia Martinez',
    DIRECCION: 'Calle 100 # 19-61',
    TELEFONO: '3123456789',
    TELEFONO2: '',
    EMPRESA: '',
    DIRECCIONEMP: '',
    SALDO: 0,
    NOTA: 'Pide siempre disfraces talla S.'
  }
];

export const initialFacturas: Factura[] = [
  {
    IDFACTURA: 1,
    NUMEROFACT: 'REC-1040',
    FECHASALIDA: '2026-08-28',
    FECHAENTRADA: '2026-08-31',
    FTOTALDEPOSITO: 50000,
    FTOTALVENTADEPOSITO: 0,
    FORMAPAGO: 'EFECTIVO',
    MODO: 'PUNTO DE VENTA',
    VENDEDOR: 'Carlos Mendoza',
    CCLIENTE: 'Ana María Rodríguez',
    CCEDULA: '1018293847',
    CDIRECCION: 'Calle 72 # 11-45 Apto 302',
    CTELEFONO: '3159876543',
    CAMBIOS: 10000,
    PAGACON: 120000,
    ESTADOCLIENTE: 'PENDIENTE DEVOLUCION',
    PAGOCONEFECTIVO: 120000,
    PAGOCONTRANFERENCIA: 0,
    FTOTALALQUILER: 60000,
    DESCUENTO: 0,
    TOTAL_SALDO: 0,
    items: [
      {
        AUTOMATIC: 1,
        DESCRIPCION: 'Disfraz Spiderman Adulto Premium (Talla L)',
        CANTIDAD: 1,
        VALOR: 60000,
        TOTAL: 110000,
        BARRAS: '7701001001',
        NUMEROFACT: 'REC-1040',
        IDFACTURA: 1,
        VALORDEPOSITO: 50000,
        TOTALALQUILER: 60000,
        TOTALDEPOSITO: 50000
      }
    ]
  }
];

export const initialGastos: Gasto[] = [
  {
    IDgastos: 1,
    NUMEROGASTO: 'GAS-001',
    DESCRIPCIONSALIDA: 'Compra de bolsas y detergente especial lavandería',
    FECHA: '2026-08-30',
    VALORSALIDA: 35000
  }
];
