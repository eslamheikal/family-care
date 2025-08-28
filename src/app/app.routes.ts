import { Routes } from '@angular/router';
import { Dashboard } from './modules/dashboard/dashboard';
import { UiControls } from './modules/ui-controls/ui-controls';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: Dashboard
    // },
    {
        path: '',
        component: UiControls
    }
];
