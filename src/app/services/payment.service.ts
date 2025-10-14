import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Payment {
  id:number;
  name:string;
  is_deleted:boolean;
}

@Injectable({
  providedIn: 'root'
})

export class PaymentService{
  private apiUrl = env.api_url+'/api/payments';
  constructor( private http : HttpClient) { }

  getPayments() : Observable<Payment[]>{
    return this.http.get<Payment[]>(this.apiUrl).pipe(
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
}