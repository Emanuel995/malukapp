import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('➡️ HTTP Request:', {
    method: req.method,
    url: req.urlWithParams,
    headers: req.headers,
    body: req.body
  });

  return next(req).pipe(
    tap({
      next: event => console.log('⬅️ HTTP Response:', event),
      error: error => console.error('❌ HTTP Error:', error)
    })
  );
};
