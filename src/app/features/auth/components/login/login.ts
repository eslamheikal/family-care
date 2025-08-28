import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';

@Component({
  selector: 'app-login',
  imports: [TranslateModule, InputLabel, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authApiService = inject(AuthApiService);
  private toastService = inject(ToastService);
  private loader = inject(LoaderService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.initForm();
    this.loadRememberMeState();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      keepLoggedIn: [false],
    });
  }

  getFormControl(controlName: string) {
    return this.loginForm.get(controlName) as FormControl;
  }

  private loadRememberMeState(): void {
    // Pre-fill remember me checkbox if it was previously enabled
    if (this.authService.isRememberMeEnabled()) {
      this.loginForm.patchValue({ keepLoggedIn: true });
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loader.show();
    this.authApiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((result) => {
      if(result.user && result.user.id > 0){
        this.toastService.showSuccess(this.translate.instant('auth.loginSuccess'));
        this.authService.saveAuthData(result, this.loginForm.value.keepLoggedIn);
        
        // Redirect to saved URL or default to home
        const redirectUrl = localStorage.getItem('redirectUrl') || '/';
        localStorage.removeItem('redirectUrl'); // Clean up
        this.router.navigate([redirectUrl]);
      }
    }, _ => {}, () => this.loader.hide());
  }
}
