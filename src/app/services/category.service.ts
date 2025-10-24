import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from './env';
import { Response } from './response';

export interface Category {
  id: number;
  name: string;
  is_deleted?: boolean;
}
export interface Filter {
  includeDeleted?: boolean,
  name?: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = env.api_url + '/api/categories';
  constructor(private http: HttpClient) { }

  getCategories(filter?: Filter): Observable<Category[]> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(
        ([key, value]) => {
          if (value !== null && value !== undefined && value !== '') params = params.append(key, value);
        }
      );
    }
    
    return this.http.get<Category[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error("Error al obtener categorias: " + error.error.error);
        return of([]);
      })
    );
  }
  createCategory(category: Category): Observable<Response<Category>> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      map((resp: Category) => {
        return {
          isError: false,
          message: 'Categoria creada correctamente',
          data: resp
        }
      }),
      catchError(error => {
        return of(
          {
            isError: true,
            message: 'Error al crear Categoria: ' + error.error.error
          }
        );
      }))

  }
  updateCategory(category: Category): Observable<Response<Category>> {
    return this.http.put<Category>(this.apiUrl + '/' + category.id, category).pipe(
      map((resp: Category) => {
        return {
          isError: false,
          message: 'Categoria actualizada correctamente',
          data: resp
        }
      }),
      catchError(error => {
        console.log("Error al actualizar categoria: " + error.error.error);
        return of(
          {
            isError: true,
            message: 'Error al actualizar Categoria: ' + error.error.error
          });
      }))
  }

  deactivate(id: number): Observable<Response<Category>> {
    let response: Observable<Response<Category>>;
    response = this.http.delete(this.apiUrl + '/' + id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Categoria Desactivado correctamente'
        }
      }),
      catchError(error => {
        console.log("Error al Desactivar Categoria: " + error.error.error);
        return of({
          isError: true,
          message: 'Error al Desactivar Categoria: ' + error.error.error
        }
        );
      })
    );
    return response
  }

  activate(id: number): Observable<Response<Category>> {
    let response: Observable<Response<Category>>;
    response = this.http.delete(this.apiUrl + '/restore/' + id).pipe(
      map(() => {
        return {
          isError: false,
          message: 'Categoria Desactivado correctamente'
        }
      }),
      catchError(error => {
        console.log("Error al Desactivar Categoria: " + error.error.error);
        return of({
          isError: true,
          message: 'Error al Desactivar Categoria: ' + error.error.error
        }
        );
      })
    );
    return response
  }

}
