import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Payment {
  id:number;
  name:string;
  is_deleted:boolean;
}
export interface Filter {
  includeDeleted?: boolean,
  name?: string
}

@Injectable({
  providedIn: 'root'
})

export class PaymentService{
  private apiUrl = env.api_url+'/api/payments';
  constructor( private http : HttpClient) { }

  getPayments(filter?:Filter) : Observable<Payment[]>{
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(
        ([key, value]) => {
          if (value !== null && value !== undefined && value !== '') params = params.append(key, value);
        }
      );
    }
    return this.http.get<Payment[]>(this.apiUrl, { params }).pipe(
      catchError( error => {
        console.error("Error al obtener formas de pago: "+ error.error.error);
        return of([]);
      })
    );
  }

  createPayment(payment:Payment):Observable<Response<Payment>>{
    return this.http.post<Payment>(this.apiUrl,payment).pipe(
      map((resp : Payment) => {
        return {
          isError: false,
          message:'Forma de pago creada correctamente',
          data:resp
        }
      }),      
      catchError (error => {
        return of(
          {
          isError: true,
          message:'Error al crear la forma de pago: '+ error.error.error
        }
        );
      }))
    
  }
  updatePayment(payment:Payment):Observable<Response<Payment>>{
    return this.http.put<Payment>(this.apiUrl+'/'+payment.id,payment).pipe( 
      map((resp : Payment) => {
        return {
          isError: false,
          message:'Forma de pago actualizada correctamente',
          data:resp
        }
      }),             
      catchError (error => {
        return of(          
        {
          isError: true,
          message:'Error al actualizar forma de pago: '+ error.error.error
        });
      }))
  }

  deactivate(id:number):Observable<Response<Payment>>{
    let response : Observable<Response<Payment>>;
    response = this.http.delete(this.apiUrl+'/'+id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Metodo de Pago Desactivado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Desactivar Metodo de Pago: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Desactivar Metodo de Pago: ' + error.error.error
          }
        );
      })
    );
    return response
  }

  activate(id:number):Observable<Response<Payment>>{
    let response : Observable<Response<Payment>>;
    response = this.http.delete(this.apiUrl+'/restore/'+id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Metodo de Pago Desactivado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Desactivar Metodo de Pago: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Desactivar Metodo de Pago: ' + error.error.error
          }
        );
      })
    );
    return response
  }
}