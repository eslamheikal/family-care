import { Routes } from "@angular/router";
import { TitleResolver } from "../../core/resolvers/title.resolver";
import { UsersList } from "./components/users-list/users-list";
import { UserProfile } from "./components/user-profile/user-profile";
import { UserForm } from "./components/user-form/user-form";

export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersList,
        resolve: { title: TitleResolver },
        data: {
          subtitle: 'users.all'
        }
    },
    {
        path: ':id',
        component: UserProfile,
        resolve: { title: TitleResolver },
        data: {
          subtitle: 'users.formTitle'
        }
    }
];

export default USERS_ROUTES;
