import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoints } from '../consts/endpoints';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class UserService extends ApiService<User> {

  constructor(httpClient: HttpClient) {
    super(httpClient, Endpoints.USERS.Controller);
  }

}