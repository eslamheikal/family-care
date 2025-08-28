import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-gateway-timeout',
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './gateway-timeout.html',
  styleUrl: './gateway-timeout.scss'
})
export class GatewayTimeoutComponent {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  goHome() {
    this.router.navigate(['/']);
  }

  //#endregion
} 