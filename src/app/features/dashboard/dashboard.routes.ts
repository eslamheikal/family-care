import { Routes } from "@angular/router";
import { LayoutDashboard } from "./components/layout-dashboard/layout-dashboard";
import { TitleResolver } from "../../core/resolvers/title.resolver";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: LayoutDashboard,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'DASHBOARD.TITLE',
            translateTitle: true
        }
    }
];
