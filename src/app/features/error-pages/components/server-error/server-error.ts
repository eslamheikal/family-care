import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-server-error',
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './server-error.html',
  styleUrl: './server-error.scss'
})
export class ServerErrorComponent {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  goHome() {
    this.router.navigate(['/']);
  }

  //#endregion
} 