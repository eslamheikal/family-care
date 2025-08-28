import { Routes } from "@angular/router";
import { SessionsList } from "./components/sessions-list/sessions-list";
import { SessionAttendance } from "./components/session-attendance/session-attendance";
import { canDeactivateForm } from "../../core/guards/form-deactivate.guard";
import { TitleResolver } from "../../core/resolvers/title.resolver";

export const SESSIONS_ROUTES: Routes = [
    {
        path: '',
        component: SessionsList,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'sessions.all'
        }
    },
    {
        path: ':sessionId/attendance',
        component: SessionAttendance,
        canDeactivate: [canDeactivateForm],
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'attendance.recordAttendance'
        }
    }
]