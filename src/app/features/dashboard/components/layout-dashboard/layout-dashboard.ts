import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminDashboard } from "../admin-dashboard/admin-dashboard";
import { TeacherDashboard } from "../teacher-dashboard/teacher-dashboard";
import { StudentDashboard } from "../student-dashboard/student-dashboard";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-dashboard',
  imports: [CommonModule, AdminDashboard, TeacherDashboard, StudentDashboard],
  templateUrl: './layout-dashboard.html',
  styleUrl: './layout-dashboard.scss'
})
export class LayoutDashboard {

  public authService = inject(AuthService);
}
