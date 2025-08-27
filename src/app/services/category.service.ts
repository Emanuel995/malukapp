import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';

export interface Category {
  id:number;
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = env.api_url+'/api/categories';
  constructor( private http : HttpClient ) { }

  getCategories() : Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError( error => {
        console.error("Error al obtener categorias: "+ error.error.error);
        return of([]);
      })
    );
  }
}
