import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionAccessService {

    private authService = inject(AuthService);

    get canViewSideNav() {
        return {
            families: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canExport() {
        return {
            exportAttendancePdf: this.authService.isAdmin || this.authService.isEmployee,
            exportSchedulePdf: this.authService.isAdmin || this.authService.isEmployee,
            exportSessionsPdf: this.authService.isAdmin || this.authService.isEmployee,
            exportStudentDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember,
            exportTeacherDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            exportGroupDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            exportStudentAttendancePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember,
            exportStudentFeedbackPdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember
        };
    }

    get canView() {
        return {
            familyProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            groupProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            studentProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember,
            courseProfile: this.authService.isAdmin || this.authService.isEmployee,
            teacherProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            studentSchedule: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember,
            studentAttendance: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyMember
        };
    }

    get canViewPagedAdminColumns() {
        return {
            family: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canAdd() {
        return {
            family: this.authService.isAdmin || this.authService.isEmployee,
            group: this.authService.isAdmin || this.authService.isEmployee,
            student: this.authService.isAdmin || this.authService.isEmployee,
            teacher: this.authService.isAdmin || this.authService.isEmployee,
            room: this.authService.isAdmin || this.authService.isEmployee,
            course: this.authService.isAdmin || this.authService.isEmployee,
            schedule: this.authService.isAdmin || this.authService.isEmployee,
            refreshSessions: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canEdit() {
        return {
            family: this.authService.isAdmin || this.authService.isEmployee,
            group: this.authService.isAdmin || this.authService.isEmployee,
            room: this.authService.isAdmin || this.authService.isEmployee,
            course: this.authService.isAdmin || this.authService.isEmployee,
            teacher: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            teacherOnlyAdminOrEmployee: this.authService.isAdmin || this.authService.isEmployee,
            teacherCourses: this.authService.isAdmin || this.authService.isEmployee,
            student: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            studentOnlyAdminOrEmployee: this.authService.isAdmin || this.authService.isEmployee,
            schedule: this.authService.isAdmin || this.authService.isEmployee,
            session: this.authService.isAdmin || this.authService.isEmployee,
            recordStudentAttendance: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            studentAttendance: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToBeRescheduled: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToBeCancelled: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToRecord: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
            studentAttendanceToBeCompleted: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
        };
    }

    get canDelete() {
        return {
            family: this.authService.isAdmin,
            group: this.authService.isAdmin,
            student: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            schedule: this.authService.isAdmin,
            session: this.authService.isAdmin,
        };
    }

    get canActivate() {
        return {
            family: this.authService.isAdmin,
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            student: this.authService.isAdmin,
        };
    }

    get canDeactivate() {
        return {
            family: this.authService.isAdmin,
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            student: this.authService.isAdmin,
        };
    }

    get canDownload() {
        return {
            studentAttachment: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
        };
    }
}
