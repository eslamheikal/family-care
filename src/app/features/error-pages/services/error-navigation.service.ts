import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorNavigationService {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  navigateToNotFound() {
    this.router.navigate(['/error/404']);
  }

  navigateToAccessDenied() {
    this.router.navigate(['/error/403']);
  }

  navigateToServerError() {
    this.router.navigate(['/error/500']);
  }

  navigateToServiceUnavailable() {
    this.router.navigate(['/error/503']);
  }

  navigateToGatewayTimeout() {
    this.router.navigate(['/error/504']);
  }

  navigateToError(errorCode: number) {
    switch (errorCode) {
      case 403:
        this.navigateToAccessDenied();
        break;
      case 404:
        this.navigateToNotFound();
        break;
      case 500:
        this.navigateToServerError();
        break;
      case 503:
        this.navigateToServiceUnavailable();
        break;
      case 504:
        this.navigateToGatewayTimeout();
        break;
      default:
        this.navigateToServerError();
        break;
    }
  }
  //#endregion
} 