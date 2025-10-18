import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned).pipe(
      catchError((error)=>{
        if(error.status === 401){
          console.warn('🚫 Token inválido o expirado. Redirigiendo al login...');
          localStorage.removeItem('auth_token');
          router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

  return next(req);
};
