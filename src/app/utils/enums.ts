  //Views
  export const ViewOptions = {
    Categories: 'categories',
    Units: 'units',
    Stock: 'stock',
    Payment: 'payment',
    Provider: 'provider',
  } as const;
  export type ViewOption = typeof ViewOptions[keyof typeof ViewOptions];

  //Mode
  