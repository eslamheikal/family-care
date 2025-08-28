import { Routes } from '@angular/router';
import { SchedulsCalendar } from './components/scheduls-calendar/scheduls-calendar';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const SCHEDULES_ROUTES: Routes = [
    {
        path: '',
        component: SchedulsCalendar,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'schedules.all'
        }
    }
];
