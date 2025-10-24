import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Unit {
  id:number;
  name:string;
  description:string;
  is_deleted?:boolean;
}

export interface Filter{
  includeDeleted?:boolean
}
@Injectable({
  providedIn: 'root'
})

export class UnitService {
  private apiUrl = env.api_url+'/api/units'
  constructor(private http : HttpClient) { }

  getUnits(filter?:Filter):Observable<Unit[]>{
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(
        ([key, value]) => {
          if (value !== null && value !== undefined && value !== '') params = params.append(key, value);
        }
      );
    }
    
    return this.http.get<Unit[]>(this.apiUrl, { params }).pipe(
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

  deactivate(id:number):Observable<Response<Unit>>{
    let response : Observable<Response<Unit>>;
    response = this.http.delete(this.apiUrl+'/'+id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Categoria Desactivado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Desactivar Categoria: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Desactivar Categoria: ' + error.error.error
          }
        );
      })
    );
    return response
  }

  activate(id:number):Observable<Response<Unit>>{
    let response : Observable<Response<Unit>>;
    response = this.http.delete(this.apiUrl+'/restore/'+id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Categoria Desactivado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Desactivar Categoria: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Desactivar Categoria: ' + error.error.error
          }
        );
      })
    );
    return response
  }
}
