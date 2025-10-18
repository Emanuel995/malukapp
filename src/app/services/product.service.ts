import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map} from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id:number;
  category_name:string;
  unit_id:number;
  unit_name:string;
  is_deleted:boolean;
}
export interface ProductFilter{
  page?:number,
  pageSize?:number,
  search?:string,
  includeDeleted?:boolean
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = env.api_url+'/api/products';
  
  constructor( private http : HttpClient) {   
  }

  getProducts(filters : ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(
      ([key,value])=>{
        if (value !== null && value !== undefined && value !== '') params = params.append(key,value);
      }
    );
        
    return this.http.get<{items : Product[]}>(this.apiUrl, { params }).pipe(    
      map(response => response.items ),      
      catchError( error => {
        console.error("Error al obtener productos: "+ error.error.error);
        return of([]);
      })
    );
  }

  createProduct(product: Product) : Observable<Response<Product>> {
    
    return this.http.post<Product>(this.apiUrl, product).pipe(
      map((resp: Product) => {
        return {
          isError: false,
          message: 'Producto Registrado correctamente',
          data: resp
        }
      }),
      catchError (error => {
        console.log("Error al crear producto: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Crear Producto: ' + error.error.error
          }
        );
      })
    );
  }

  updateProduct(product:Product): Observable<Response<Product>>{
    console.log(product);
    
    return this.http.put<Product>(this.apiUrl+'/'+product.id, product).pipe(
      map((resp: Product) => {
        return {
          isError: false,
          message: 'Producto Actualizado Correctamente',
          data: resp
        }
      }),
      catchError (error => {
        console.log("Error al Actualizar Producto: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Actualizar Producto: ' + error.error.error
          }
        );
      })
    );
  }

  activateProduct(product:Product):Observable<Response<Product>>{
    let response : Observable<Response<Product>>;
    response = this.http.delete<Product>(this.apiUrl+'/restore/'+product.id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Producto Activado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Activar producto: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Activar Producto: ' + error.error.error
          }
        );
      })
    );
    return response
  }

  deactivateProduct(product:Product):Observable<Response<Product>>{
    let response : Observable<Response<Product>>;
    response = this.http.delete<Product>(this.apiUrl+'/'+product.id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Producto Desactivado correctamente'
        }
      }),
      catchError (error => {
        console.log("Error al Desactivar producto: "+ error.error.error);
        return of(          {
            isError: true,
            message: 'Error al Desactivar Producto: ' + error.error.error
          }
        );
      })
    );
    return response
  }

}
