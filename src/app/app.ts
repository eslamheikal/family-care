import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { Sidenav } from './layout/sidenav/sidenav';
import { Footer } from "./layout/footer/footer";
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { AuthLayout } from "./features/auth/components/auth-layout/auth-layout";
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Header, Sidenav, Footer, RouterOutlet, TooltipModule, ToastModule, NgxUiLoaderModule, ConfirmDialogModule, AuthLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  protected readonly isLoggedIn = signal(false);

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn.set(user !== null);
    });
  }

}
