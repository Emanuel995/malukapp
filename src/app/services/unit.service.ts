import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Unit {
  id:number;
  name:string;
  description:string;
}
@Injectable({
  providedIn: 'root'
})

export class UnitService {
  private apiUrl = env.api_url+'/api/units'
  constructor(private http : HttpClient) { }

  getUnits():Observable<Unit[]>{
    return this.http.get<Unit[]>(this.apiUrl).pipe(
      catchError( error => {
        console.error("Error al obtener unidades: "+ error.error.error);
        return of([]);
      })
    );
  }
  createUnit(unit:Unit):Observable<Response<Unit>>{
    return this.http.post<Unit>(this.apiUrl,unit).pipe(
      map((resp : Unit) => {
        return {
          isError: false,
          message:'Unidad creada correctamente',
          data:resp
        }
      }),      
      catchError (error => {
        return of(
          {
          isError: true,
          message:'Error al crear Unidad: '+ error.error.error
        }
        );
      }))
  }
  updateUnit(unit:Unit){
    return this.http.put<Unit>(this.apiUrl+'/'+unit.id,unit).pipe(
      map((resp : Unit) => {
        return {
          isError: false,
          message:'Unidad actualizada correctamente',
          data:resp
        }
      }),      
      catchError (error => {
        return of(
          {
          isError: true,
          message:'Error al actualizar Unidad: '+ error.error.error
        }
        );
      }))
  }
}
