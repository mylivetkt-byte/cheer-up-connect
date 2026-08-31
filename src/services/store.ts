import {
  Articulo,
  Cliente,
  Factura,
  CampoFactura,
  AbonoCliente,
  DepositoEntregado,
  Gasto,
  Empresa,
  Caja,
  Usuario,
  ReservaApartado
} from '../types/database';
import {
  initialArticulos,
  initialClientes,
  initialFacturas,
  initialGastos,
  initialEmpresa,
  initialCaja,
  initialUsuario
} from './initialData';

const KEYS = {
  ARTICULOS: 'lcd_articulos_v1',
  CLIENTES: 'lcd_clientes_v1',
  FACTURAS: 'lcd_facturas_v1',
  ABONOS: 'lcd_abonos_v1',
  DEPOSITOS: 'lcd_depositos_v1',
  GASTOS: 'lcd_gastos_v1',
  EMPRESA: 'lcd_empresa_v1',
  CAJA: 'lcd_caja_v1',
  USUARIO: 'lcd_usuario_v1',
  APARTADOS: 'lcd_apartados_v1'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage`, e);
  }
}

export interface AppState {
  articulos: Articulo[];
  clientes: Cliente[];
  facturas: Factura[];
  abonos: AbonoCliente[];
  depositosEntregados: DepositoEntregado[];
  gastos: Gasto[];
  empresa: Empresa;
  caja: Caja;
  usuario: Usuario;
  apartados: ReservaApartado[];
}

export function loadAppState(): AppState {
  return {
    articulos: getStored(KEYS.ARTICULOS, initialArticulos),
    clientes: getStored(KEYS.CLIENTES, initialClientes),
    facturas: getStored(KEYS.FACTURAS, initialFacturas),
    abonos: getStored(KEYS.ABONOS, []),
    depositosEntregados: getStored(KEYS.DEPOSITOS, []),
    gastos: getStored(KEYS.GASTOS, initialGastos),
    empresa: getStored(KEYS.EMPRESA, initialEmpresa),
    caja: getStored(KEYS.CAJA, initialCaja),
    usuario: getStored(KEYS.USUARIO, initialUsuario),
    apartados: getStored(KEYS.APARTADOS, [
      {
        ID: 1,
        NUMERORESERVA: 'RES-001',
        CLIENTE_NOMBRE: 'Jorge Enrique Gómez',
        CLIENTE_CEDULA: '801928374',
        FECHA_EVENTO: '2026-10-31',
        ABONO_INICIAL: 30000,
        TOTAL: 95000,
        ESTADO: 'ACTIVA',
        ITEMS_DESCRIPCION: 'Traje de Gala Tuxedo Negro (Reserva Hallowen)'
      }
    ])
  };
}

export function saveAppState(state: AppState): void {
  setStored(KEYS.ARTICULOS, state.articulos);
  setStored(KEYS.CLIENTES, state.clientes);
  setStored(KEYS.FACTURAS, state.facturas);
  setStored(KEYS.ABONOS, state.abonos);
  setStored(KEYS.DEPOSITOS, state.depositosEntregados);
  setStored(KEYS.GASTOS, state.gastos);
  setStored(KEYS.EMPRESA, state.empresa);
  setStored(KEYS.CAJA, state.caja);
  setStored(KEYS.USUARIO, state.usuario);
  setStored(KEYS.APARTADOS, state.apartados);
}

// Helpers de utilidades
export function formatCurrency(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) || 0 : val;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num);
}

export function generatePostgresDump(state: AppState): string {
  let sql = `-- Script generado por La Casa Del Disfraz (Lovable POS)
-- Compatible con PostgreSQL
-- Fecha: ${new Date().toISOString()}

-- EMPRESA
INSERT INTO "Empresa" ("IDEmpresa", "RAZOSOCIAL", "ENOMBRE", "NIT", "ETIPO", "EDIRECCION", "ETELEFONO", "EMAIL", "WEB", "SERIE", "MENSAJE")
VALUES (1, '${state.empresa.RAZOSOCIAL.replace(/'/g, "''")}', '${state.empresa.ENOMBRE.replace(/'/g, "''")}', '${state.empresa.NIT}', '${state.empresa.ETIPO}', '${state.empresa.EDIRECCION}', '${state.empresa.ETELEFONO}', '${state.empresa.EMAIL}', '${state.empresa.WEB}', '${state.empresa.SERIE}', '${state.empresa.MENSAJE}')
ON CONFLICT ("IDEmpresa") DO UPDATE SET "RAZOSOCIAL" = EXCLUDED."RAZOSOCIAL";

-- ARTICULOS (${state.articulos.length} registros)
`;

  state.articulos.forEach(art => {
    sql += `INSERT INTO "ARTICULO" ("IDARTICULO", "DESCRIPCION", "TALLA", "STOCK", "VALOR", "CODBARRAS", "VALORDEPOSITO")
VALUES (${art.IDARTICULO}, '${art.DESCRIPCION.replace(/'/g, "''")}', '${art.TALLA}', ${art.STOCK}, ${art.VALOR}, '${art.CODBARRAS}', ${art.VALORDEPOSITO})
ON CONFLICT ("IDARTICULO") DO NOTHING;\n`;
  });

  sql += `\n-- CLIENTES (${state.clientes.length} registros)\n`;
  state.clientes.forEach(c => {
    sql += `INSERT INTO "CLIENTES" ("IDCLIENTES", "CEDULA", "DIRECCION", "TELEFONO", "TELEFONO2", "EMPRESA", "DIRECCIONEMP", "NOMBRE", "SALDO", "NOTA")
VALUES (${c.IDCLIENTES}, ${c.CEDULA}, '${(c.DIRECCION||'').replace(/'/g, "''")}', '${c.TELEFONO}', '${c.TELEFONO2||''}', '${(c.EMPRESA||'').replace(/'/g, "''")}', '${(c.DIRECCIONEMP||'').replace(/'/g, "''")}', '${c.NOMBRE.replace(/'/g, "''")}', ${c.SALDO}, '${(c.NOTA||'').replace(/'/g, "''")}')
ON CONFLICT ("IDCLIENTES") DO NOTHING;\n`;
  });

  sql += `\n-- FACTURA (${state.facturas.length} registros)\n`;
  state.facturas.forEach(f => {
    sql += `INSERT INTO "FACTURA" ("IDFACTURA", "NUMEROFACT", "FECHASALIDA", "FECHAENTRADA", "FTOTALDEPOSITO", "FTOTALVENTADEPOSITO", "FORMAPAGO", "MODO", "VENDEDOR", "CCLIENTE", "CCEDULA", "CDIRECCION", "CTELEFONO", "CAMBIOS", "PAGACON", "ESTADOCLIENTE", "PAGOCONEFECTIVO", "PAGOCONTRANFERENCIA", "FTOTALALQUILER", "DESCUENTO", "TOTAL_SALDO")
VALUES (${f.IDFACTURA}, '${f.NUMEROFACT}', '${f.FECHASALIDA}', '${f.FECHAENTRADA}', ${f.FTOTALDEPOSITO}, ${f.FTOTALVENTADEPOSITO}, '${f.FORMAPAGO}', '${f.MODO}', '${f.VENDEDOR}', '${f.CCLIENTE.replace(/'/g, "''")}', '${f.CCEDULA}', '${f.CDIRECCION}', '${f.CTELEFONO}', ${f.CAMBIOS}, ${f.PAGACON}, '${f.ESTADOCLIENTE}', ${f.PAGOCONEFECTIVO}, ${f.PAGOCONTRANFERENCIA}, ${f.FTOTALALQUILER}, ${f.DESCUENTO}, ${f.TOTAL_SALDO})
ON CONFLICT ("IDFACTURA") DO NOTHING;\n`;
  });

  return sql;
}
