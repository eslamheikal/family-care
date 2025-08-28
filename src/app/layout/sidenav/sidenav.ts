import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PermissionAccessService } from '../../core/services/permission-access.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, ScrollPanelModule, RouterModule, TranslateModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

  private router = inject(Router);
  public permissionAccess = inject(PermissionAccessService);

  isActiveRoute(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }
}
