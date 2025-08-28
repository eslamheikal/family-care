import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export function languageInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const translateService = inject(TranslateService);

  // Get current language with fallback priority
  const currentLang = localStorage.getItem('lang') || 
                     translateService.currentLang || 
                     translateService.defaultLang || 
                     'ar';
  
  // Clone request with Accept-Language header
  const languageRequest = request.clone({
    setHeaders: {
      'Accept-Language': currentLang
    }
  });

  return next(languageRequest);
}