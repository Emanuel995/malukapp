import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';
import { Response } from './response';

export interface Category {
  id:number;
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = env.api_url+'/api/categories';
  constructor( private http : HttpClient) { }

  getCategories() : Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError( error => {
        console.error("Error al obtener categorias: "+ error.error.error);
        return of([]);
      })
    );
  }
  createCategory(category:Category):Observable<Response<Category>>{
    return this.http.post<Category>(this.apiUrl,category).pipe(
      map((resp : Category) => {
        return {
          isError: false,
          message:'Categoria creada correctamente',
          data:resp
        }
      }),      
      catchError (error => {
        return of(
          {
          isError: true,
          message:'Error al crear Categoria: '+ error.error.error
        }
        );
      }))
    
  }
  updateCategory(category:Category):Observable<Response<Category>>{
    return this.http.put<Category>(this.apiUrl+'/'+category.id,category).pipe( 
      map((resp : Category) => {
        return {
          isError: false,
          message:'Categoria actualizada correctamente',
          data:resp
        }
      }),             
      catchError (error => {
        console.log("Error al actualizar categoria: "+ error.error.error);
        return of(          
        {
          isError: true,
          message:'Error al actualizar Categoria: '+ error.error.error
        });
      }))
  }
}
