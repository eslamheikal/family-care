import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-access-denied',
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.scss'
})
export class AccessDeniedComponent {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  goHome() {
    this.router.navigate(['/']);
  }

  //#endregion
} 