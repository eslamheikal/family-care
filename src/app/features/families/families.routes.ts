import { Routes } from "@angular/router";
import { FamiliesList } from "./components/families-list/families-list";
import { TitleResolver } from "../../core/resolvers/title.resolver";
import { FamilyProfile } from "./components/family-profile/family-profile";

export const FAMILIES_ROUTES: Routes = [
    {
        path: '',
        component: FamiliesList,
        resolve: { title: TitleResolver },
        data: {
          subtitle: 'families.all'
        }
    },
    {
        path: ':id',
        component: FamilyProfile,
        resolve: { title: TitleResolver },
        data: {
          subtitle: 'families.formTitle'
        }
    }
];

export default FAMILIES_ROUTES;
