import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class RoomService extends ApiService<Room> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.ROOMS.Controller);
  }

  activate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.ROOMS.Actions.Activate(id)), {});
  }

  deactivate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.ROOMS.Actions.Deactivate(id)), {});
  }

}