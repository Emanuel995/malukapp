  //Views
  export const ViewOptions = {
    Categories: 'categories',
    Units: 'units',
    Stock: 'stock',
    Payments: 'payments',
    Provider: 'provider',
  } as const;
  export type ViewOption = typeof ViewOptions[keyof typeof ViewOptions];

  export function getDateFormatString(date:Date):string{
   let datestring = date.toLocaleDateString();

   let datearray = datestring.split('/') 
   let year = datearray[2]
   let month = datearray[1].padStart(2,"0")
   let day = datearray[0];
   datestring = `${year}-${month}-${day}`
   return datestring;
  }
  