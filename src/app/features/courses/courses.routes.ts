import { Routes } from '@angular/router';
import { CoursesList } from './components/courses-list/courses-list';
import { CourseProfile } from './components/course-profile/course-profile';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const COURSES_ROUTES: Routes = [
    {
        path: '',
        component: CoursesList,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'courses.all'
        }
    },
    {
        path: ':id',
        component: CourseProfile,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'courses.formTitle'
        }
    }
];
