import { Injectable } from '@angular/core';

export interface Unit {
  unit_id:number;
  name:string;
}
const listUnits = [
  {
    unit_id:1,
    name:"KG"
  },
  {
    unit_id:2,
    name:"UN"
  }
];

@Injectable({
  providedIn: 'root'
})

export class UnitService {

  constructor() { }

  getUnits():Unit[]{
    return listUnits;
  }
}
