import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-service-unavailable',
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './service-unavailable.html',
  styleUrl: './service-unavailable.scss'
})
export class ServiceUnavailableComponent {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  goHome() {
    this.router.navigate(['/']);
  }

  //#endregion
} 