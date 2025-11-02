import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, of } from 'rxjs';
import {env} from './env';

export interface ResponseLogin{
  error?:string,
  message?:string,
  token?:string,
  newPassword?:string,
  accessToken?:string,
  refreshToken?:string,
  expiresIn?:string
  user?:{id?:number,name?:string,email?:string}
}

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
    console.log(!!this.getToken());
    
    return !!this.getToken();
  }

  forgotPassword(email:string): Observable<ResponseLogin>{
    const body = {
      "email":email
    }
    return this.http.post(this.apiUrl+'/forgot-password',body).pipe(
      map( (resp:ResponseLogin)=>{
        console.log('respuesta servicio: ',resp);
        return resp
      }),
      catchError( (error) => {
        console.log(error)
        return of();        
      } )
    );
  }

  resetPassword(token:string,newPassword:string) : Observable<ResponseLogin>{
    const body = {
      "token":token,
      "newPassword":newPassword
    }
    let responseLogin : Observable<ResponseLogin>
    responseLogin = this.http.post(this.apiUrl+'/reset-password',body).pipe(
      map( (resp:ResponseLogin)=>{
        return resp
      }),
      catchError( (error) => {
        let responseError : any;
        responseError = {
        error : 'true',
        message : error.error.error
        }

        return of(responseError);        
      } )
    );

    return responseLogin;
  }
}