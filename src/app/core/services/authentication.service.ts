import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Endpoints } from '../consts/endpoints';
import { LoginResult } from '../models/login-result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient, Endpoints.AUTH.Controller);
  }

  login(emailOrPhone: string, password: string): Observable<LoginResult> {
    return this.httpClient.post<LoginResult>(
      this.appURLGenerator.getEndPointWithActionQuery(Endpoints.AUTH.Actions.Login), 
      { emailOrPhone, password }
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      this.appURLGenerator.getEndPointWithActionQuery(Endpoints.AUTH.Actions.ForgetPassword(email))
    );
  }
  
} 