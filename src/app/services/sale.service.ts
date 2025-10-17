import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from './env';
import { Response } from './response';
import { Product } from './product.service';

export interface Sale {
  id: number,
  date: Date,
  total: number,
  payment_id:number,
  payment_name:string,
  state_id: number,
  state_name:string,
  items: Items[],
  kind_id:number,
  kind_name:string
}
export interface Page {
  items: Sale[],
  total: number,
  page: number,
  pageSize: number,
  pages: number
}

export interface Items {
  sale_id:number,
  product_id:number,
  product_name:string,
  quantity:number,
  unit_price:number,
  subtotal:number,
  product:Product | null,
}

export interface Filters {
  dateFrom?:string,
  dateTo?:string,
  kind_id?:number,
  state_id?:number,
  payment_id?:number
}

@Injectable({
  providedIn: 'root'
})

export class SaleService {
  private apiUrl = env.api_url + '/api/sales';
  constructor(private http: HttpClient) { }

  getSales(filters?:Filters): Observable<Page> {
    let params = new HttpParams();
    if  (filters){
      Object.entries(filters).forEach(
        ([key,value])=>{
          if (value !== null && value !== undefined && value !== '') params = params.append(key,value);
        }
      );
    }
    console.log(params);
    
    return this.http.get<Page>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error("Error al obtener Ventas: " + error.error.error);
        return of();
      })
    );
  }

    getSaleById(saleId : number): Observable<Sale> {
      
    return this.http.get<Sale>(this.apiUrl+'/'+saleId).pipe(
      catchError(error => {
        console.error("Error al obtener Ventas: " + error.error.error);
        return of();
      })
    );
  }

  createSale(sale: Sale): Observable<Response<Sale>> {
    return this.http.post<Sale>(this.apiUrl, sale).pipe(
      map((resp: Sale) => {
        return {
          isError: false,
          message: 'Venta Registrada correctamente',
          data: resp
        }
      }),
      catchError(error => {
        return of(
          {
            isError: true,
            message: 'Error al Registrar Venta: ' + error.error.error
          }
        );
      }))

  }
  updateSale(sale: Sale): Observable<Response<Sale>> {
    return this.http.put<Sale>(this.apiUrl + '/' + sale.id, sale).pipe(
      map((resp: Sale) => {
        return {
          isError: false,
          message: 'Venta actualizada correctamente',
          data: resp
        }
      }),
      catchError(error => {
        console.log("Error al actualizar Venta: " + error.error.error);
        return of(
          {
            isError: true,
            message: 'Error al actualizar Venta: ' + error.error.error
          });
      }))
  }

}
