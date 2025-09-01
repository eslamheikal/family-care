import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'error',
        loadChildren: () => import('./features/error-pages/error-pages.routes').then(m => m.ERROR_PAGES_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/error/404',
    }
];
