import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';

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
}

const listProducts = [
      {
        id: 1,
        name: 'Alimento para perro 15kg',
        description: 'Alimento balanceado DogChow para perros adultos. Sabor carne y vegetales.',
        price: 14500,
        stock: 20,
        category_id:1,
        category_name:"Alimento",
        unit_id:1,
        unit_name:"KG"
      },
      {
        id: 2,
        name: 'Collar de cuero mediano',
        description: 'Collar ajustable de cuero sintético para perro de tamaño mediano.',
        price: 3200,
        stock: 15,
        category_id:2,
        category_name:"Accesorio",
        unit_id:2,
        unit_name:"UN"
      },
      {
        id: 3,
        name: 'Rascador para gatos',
        description: 'Torre rascadora con tres niveles y base estable para gatos.',
        price: 8900,
        stock: 8,
        category_id:3,
        category_name:"Juguete",
        unit_id:3,
        unit_name:"UN"
      },
      {
        id: 4,
        name: 'Alimento para gato 7kg',
        description: 'Alimento Whiskas sabor carne y pollo para gatos adultos.',
        price: 7200,
        stock: 12,
        category_id:1,
        category_name:"Alimento",
        unit_id:1,
        unit_name:"KG"
      },
      {
        id: 5,
        name: 'Juguete hueso de goma',
        description: 'Hueso de goma resistente para perros que aman morder.',
        price: 1100,
        stock: 30,
        category_id:3,
        category_name:"Juguete",
        unit_id:3,
        unit_name:"UN"        
      }
    ];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = env.api_url+'/api/products';
  
  constructor( private http : HttpClient) {   
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError( error => {
        console.error("Error al obtener productos: "+ error.error.error);
        return of([]);
      })
    );
  }

  createProduct(product: Product) : Observable<Product> {
    
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError (error => {
        console.log("Error al crear producto: "+ error.error.error);
        return of();
      })
    );
  }

  updateProduct(product:Product){
    const index = listProducts.findIndex(p => p.id == product.id)
    if (index > -1 ){
      listProducts[index] = product;
    }
  }
}
