import { Routes } from '@angular/router';
import { GroupsList } from './components/groups-list/groups-list';
import { GroupProfile } from './components/group-profile/group-profile';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const GROUPS_ROUTES: Routes = [
    {
        path: '',
        component: GroupsList,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'groups.all'
        }
    },
    {
        path: ':id',
        component: GroupProfile,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'groups.formTitle'
        }
    }
];
