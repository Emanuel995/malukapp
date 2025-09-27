import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from './env';
import { Response } from './response';

export interface Sale {
  id: number,
  date: Date,
  total: number,
  payment_id: number,
  payment_name: string,
  state: string,
  products: ItemSale[]
}
export interface Page {
  items: Sale[],
  total: number,
  page: number,
  pageSize: number,
  pages: number
}

export interface ItemSale {
  sale_id:number,
  product_id:number,
  product_name:string,
  quatity:number,
  unit_price:number,
  subtotal:number
}

const fake : ItemSale[] = [
  {
    sale_id: 1,
    product_id: 201,
    product_name: "Alimento para perro 5kg",
    quatity: 2,
    unit_price: 45.0,
    subtotal: 90.0
  },
  {
    sale_id: 2,
    product_id: 202,
    product_name: "Arena para gato 10L",
    quatity: 1,
    unit_price: 20.0,
    subtotal: 20.0
  },
  {
    sale_id: 3,
    product_id: 203,
    product_name: "Juguete para perro",
    quatity: 3,
    unit_price: 12.5,
    subtotal: 37.5
  },
  {
    sale_id: 4,
    product_id: 204,
    product_name: "Collar para gato",
    quatity: 4,
    unit_price: 8.0,
    subtotal: 32.0
  },
  {
    sale_id: 5,
    product_id: 205,
    product_name: "Snack para perro",
    quatity: 5,
    unit_price: 3.5,
    subtotal: 17.5
  },
  {
    sale_id: 6,
    product_id: 206,
    product_name: "Cama para gato",
    quatity: 1,
    unit_price: 55.0,
    subtotal: 55.0
  }
]

@Injectable({
  providedIn: 'root'
})

export class SaleService {
  private apiUrl = env.api_url + '/api/sales';
  constructor(private http: HttpClient) { }

  getSales(): Observable<Page> {
    return this.http.get<Page>(this.apiUrl).pipe(
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
