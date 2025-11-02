import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID   } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoadingService } from './services/loading.service';
import { loadingInterceptor } from './utils/loading/loading.interceptor';
import { authInterceptor  } from './auth/auth.interceptor';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor,loadingInterceptor])
    ),
    provideAnimations(),
    {provide:LOCALE_ID,useValue:'es'},
    LoadingService
  ]
};
