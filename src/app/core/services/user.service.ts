import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoints } from '../consts/endpoints';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { AuthService } from '../authorization/auth.service';
import { QueryParamsModel } from '../../features/shared/models/query-params.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class UserService extends ApiService<User> {

  private authService = inject(AuthService);
  constructor(httpClient: HttpClient) {
    super(httpClient, Endpoints.USERS.Controller);
  }

  loadUsers(parentId: number | null = null): Observable<User[]> {
    const endpoint = this.authService.isAdmin || this.authService.isEmployee ? 
    Endpoints.USERS.Actions.FamilyParents : 
    Endpoints.USERS.Actions.FamilyMembers(parentId!);

    return this.httpClient.get<User[]>(this.appURLGenerator.getEndPointWithActionQuery(endpoint));
  }

}