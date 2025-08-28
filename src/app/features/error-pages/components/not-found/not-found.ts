import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundComponent {
  
  //#region Services
  private router = inject(Router);
  //#endregion

  //#region Methods
  goHome() {
    this.router.navigate(['/']);
  }

  //#endregion
} 