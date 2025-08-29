import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/authorization/auth.service';
import { AdminDashboard } from "../admin-dashboard/admin-dashboard";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-dashboard',
  imports: [CommonModule, AdminDashboard],
  templateUrl: './layout-dashboard.html',
  styleUrl: './layout-dashboard.scss'
})
export class LayoutDashboard {

  public authService = inject(AuthService);
}
