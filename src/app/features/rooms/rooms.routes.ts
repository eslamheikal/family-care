import { Routes } from '@angular/router';
import { RoomsList } from './components/rooms-list/rooms-list';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomsList,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'rooms.all'
        }
    }
];
