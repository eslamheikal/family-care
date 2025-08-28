import { Component, inject } from '@angular/core';
import { SelectLanguage } from '../select-language/select-language';
import { Notification } from "../notification/notification";
import { TranslateModule } from '@ngx-translate/core';
import { getRoleString, UserRoleEnum } from '../../core/enums/user-role.enum';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [SelectLanguage, Notification, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  userName = '';
  role: UserRoleEnum = UserRoleEnum.Admin;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.userName = user?.name || '';
      this.role = user?.role || UserRoleEnum.Admin;
    });
  }

  getUserRole(): string {
    return "userRole." + getRoleString(this.role);
  }

  goToProfile() {
    if(this.authService.isFamilyParent) {
      this.router.navigate(['/families' , this.authService.getUser()?.id]);
    } else if(this.authService.isFamilyMember) {
      this.router.navigate(['/families' , this.authService.getUser()?.id]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
