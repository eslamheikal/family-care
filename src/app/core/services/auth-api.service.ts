import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { LoginResult } from '../models/login-result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends ApiService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.AUTH.Controller);
  }

  login(emailOrPhone: string, password: string): Observable<LoginResult> {
    return this.httpClient.post<LoginResult>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.AUTH.Actions.Login), 
      { emailOrPhone, password }
    );
  }

  refreshToken(refreshToken: string): Observable<LoginResult> {
    return this.httpClient.post<LoginResult>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.AUTH.Actions.RefreshToken), 
      { refreshToken }
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.AUTH.Actions.ForgetPassword(email))
    );
  }
} 