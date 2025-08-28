import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found';
import { AccessDeniedComponent } from './components/access-denied/access-denied';
import { ServerErrorComponent } from './components/server-error/server-error';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable';
import { GatewayTimeoutComponent } from './components/gateway-timeout/gateway-timeout';

export const ERROR_PAGES_ROUTES: Routes = [
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '403',
    component: AccessDeniedComponent
  },
  {
    path: '500',
    component: ServerErrorComponent
  },
  {
    path: '503',
    component: ServiceUnavailableComponent
  },
  {
    path: '504',
    component: GatewayTimeoutComponent
  }
]; 