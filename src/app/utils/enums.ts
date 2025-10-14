
//Views
export const ViewOptions = {
  Categories: 'categories',
  Units: 'units',
  Stock: 'stock',
  Payments: 'payments',
  Provider: 'provider',
} as const;
export type ViewOption = typeof ViewOptions[keyof typeof ViewOptions];

export function getDateFormatString(date: Date): string {
  let datestring = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  let datearray = datestring.split('/')
  let year = datearray[2]
  let month = datearray[1].padStart(2, "0")
  let day = datearray[0];
  datestring = `${year}-${month}-${day}`
  return datestring;
}

export function getTimeFormatString(date: Date): string {
  let timestring = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return timestring;
}

export const StatesPayment = {
  Confirmado: 1,
  Pendiente: 2,
  Anulado: 3
} as const;
export type StatePayment = typeof StatesPayment[keyof typeof StatesPayment];
export type StatePaymentKey = keyof typeof StatesPayment;

export interface StateOption {
  label: string;
  value: StatePayment;
}

export function getStateOptions(): StateOption[] {
  return Object.entries(StatesPayment).map(([key, value]) => ({
    label: key,
    value: value as StatePayment
  }));
}

export function getStateLabel(value: StatePayment): string {
  const entry = Object.entries(StatesPayment).find(([_, v]) => v === value);
  return entry ? entry[0] : '';
}

export const MovementsType = {
  Venta: 1,
  Compra: 2,
  Ajuste: 3
} as const;
export type MovementType = typeof MovementsType[keyof typeof MovementsType];
export type MovementsTypeKey = keyof typeof MovementsType;

export interface MovementOption {
  label: string;
  value: MovementType;
}

export function getMovementOptions(): MovementOption[] {
  return Object.entries(MovementsType).map(([key, value]) => ({
    label: key,
    value: value as MovementType
  }));
}

export function getMovimentLabel(value: MovementType): string {
  const entry = Object.entries(MovementsType).find(([_, v]) => v === value);
  return entry ? entry[0] : '';
}