import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgetPassword } from './components/forget-password/forget-password';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'auth.login',
            translateTitle: true
        }
    },
    {
        path: 'forgot-password',
        component: ForgetPassword,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'auth.forgotPassword',
            translateTitle: true
        }
    }
];
