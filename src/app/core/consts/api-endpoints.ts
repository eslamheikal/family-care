import { ClassSessionStatus } from "../enums/class-session-status.enum";

export class ApiEndpoints {
    static readonly Generic = {
        Actions: {
            GetAll: 'all',
            GetPaged: 'paged',
            Get: (id: string | number) => `/${id}`,
            Create: 'create',
            Update: 'update',
            Delete: (id: string | number) => `/${id}`,
        }
    };

    static readonly AUTH = {
        Controller: 'auth',
        Actions: {
            Login: 'login',
            RefreshToken: 'refresh-token',
            ForgetPassword: (email: string) => `forget-password/${email}`,
        }
    };

    static readonly FAMILIES = {
        Controller: 'families',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };

    static readonly COURSES = {
        Controller: 'courses',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
            UpdateTeachers: (id: string | number) => `update-teachers/${id}`,
        }
    };

    static readonly ROOMS = {
        Controller: 'rooms',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };

    static readonly GROUPS = {
        Controller: 'groups',
        Actions: {
            Paged: `paged`,
            UpdateStudents: (groupId: string | number) => `update-students/${groupId}`,
            GetAttendances: (groupId: string | number, year: number, month: number) => `attendances/${groupId}/${year}/${month}`,
            Schedules: (groupId: string | number) => `schedules/${groupId}`,
        }
    };

    static readonly ATTACHMENTS = {
        Controller: 'attachment',
        Actions: {
            View: (fileName: string) => `view/${encodeURIComponent(fileName)}`,
            Download: (fileName: string) => `download/${encodeURIComponent(fileName)}`,
        }
    };

    static readonly TEACHERS = {
        Controller: 'teachers',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
            UploadAttachment: `upload-attachment`,
            DownloadAttachment: (id: string | number) => `download-attachment/${id}`,
            DeleteAttachment: (id: string | number) => `delete-attachment/${id}`,
            UploadImage: `upload-image`,
            GetTeachersByCourseId: (courseId: string | number) => `by-course/${courseId}`,
            Groups: (id: string | number) => `groups/${id}`,
            Schedules: (id: string | number) => `schedules/${id}`,
        }
    };

    static readonly STUDENTS = {
        Controller: 'students',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
            UploadAttachment: `upload-attachment`,
            DownloadAttachment: (id: string | number) => `download-attachment/${id}`,
            DeleteAttachment: (id: string | number) => `delete-attachment/${id}`,
            UploadImage: `upload-image`,
            Feedbacks: (id: string | number, year: number, month: number) => `feedbacks/${id}/${year}/${month}`,
            Groups: (id: string | number) => `groups/${id}`,
            Schedules: (id: string | number) => `schedules/${id}`,
        }
    };

    static readonly CLASS_SCHEDULES = {
        Controller: 'schedules',
        Actions: {
            Paged: `paged`,
            Lookups: `lookups`,
            GetMonthlySchedule: (month: number, year: number) => `monthly/${month}/${year}`,
        }
    };

    static readonly CLASS_SESSIONS = {
        Controller: 'sessions',
        Actions: {
            User: 'user',
            Paged: `paged`,
            Refresh: 'refresh',
            Lookups: (courseId: string | number) => `lookups/${courseId}`,
            UpdateStatus: (sessionId: string | number, status: ClassSessionStatus) => `update-status/${sessionId}/${status}`,
        }
    };

    static readonly STUDENT_ATTENDANCE = {
        Controller: 'student_attendances',
        Actions: {
            Session: (sessionId: string | number) => `/${sessionId}`,
            Update:  (sessionId: string | number) => `update/${sessionId}`,
            GetMonthly: (studentId: number, year: number) => `monthly/${studentId}/${year}`,
            GetDaily: (studentId: number, year: number, month: number | null = null) => `daily/${studentId}/${year}/${month}`,
        }
    };
}