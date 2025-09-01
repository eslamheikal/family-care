import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    private authService = inject(AuthService);

    get canViewSideNav() {
        return {
            users: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canExport() {
        return {
            
        };
    }

    get canView() {
        return {
            userProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent || this.authService.isFamilyMember,
        };
    }

    get canViewPagedAdminColumns() {
        return {
            user: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canAdd() {
        return {
            user: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
        };
    }

    get canEdit() {
        return {
            user: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
        };
    }

    get canDelete() {
        return {
            user: this.authService.isAdmin,
        };
    }

    get canActivate() {
        return {
            user: this.authService.isAdmin,
        };
    }

    get canDeactivate() {
        return {
            user: this.authService.isAdmin,
        };
    }

    get canDownload() {
        return {
        };
    }
}
