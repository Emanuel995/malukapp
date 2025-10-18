import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {env} from './env';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  private apiUrl = env.api_url+'/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email:string,password:string){
    const body = {
        "email":email,
        "password":password
    }
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((response: any) => {
        // Guardar el token JWT en el localStorage
        console.log(response);
        localStorage.setItem(this.tokenKey, response.accessToken);
        this.loggedIn.next(true);
      })
    );
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  getToken():string|null{
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn():boolean{
    return !!this.getToken();
  }
}