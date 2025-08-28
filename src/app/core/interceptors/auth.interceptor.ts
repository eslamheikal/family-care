import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorNavigationService } from '../../features/error-pages';

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const errorNavigationService = inject(ErrorNavigationService);

  // Add token to request headers
  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authService.isAuthenticated()) {

        // Token expired or invalid 
        authService.logout();
        router.navigate(['/auth/login']);

      } else if ((error.status === 401 || error.status === 403) && authService.isAuthenticated()) {

        // Token expired or invalid 
        errorNavigationService.navigateToAccessDenied();

      }
      return throwError(() => error);
    })
  );
} 
