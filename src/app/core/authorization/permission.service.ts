import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    private authService = inject(AuthService);

    get canViewSideNav() {
        return {
            families: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canExport() {
        return {
            
        };
    }

    get canView() {
        return {
            familyProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
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
        };
    }

    get canEdit() {
        return {
            family: this.authService.isAdmin || this.authService.isEmployee || this.authService.isFamilyParent,
        };
    }

    get canDelete() {
        return {
            family: this.authService.isAdmin,
        };
    }

    get canActivate() {
        return {
            family: this.authService.isAdmin,
        };
    }

    get canDeactivate() {
        return {
            family: this.authService.isAdmin,
        };
    }

    get canDownload() {
        return {
        };
    }
}
