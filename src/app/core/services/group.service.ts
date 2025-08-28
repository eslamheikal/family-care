import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Group, GroupAttendance } from '../models/group.model';
import { Observable } from 'rxjs';
import { DailySchedule } from '../models/daily-schedule.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class GroupService extends ApiService<Group> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.GROUPS.Controller);
  }

  updateStudents(groupId: number, studentIds: number[]): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.GROUPS.Actions.UpdateStudents(groupId)), studentIds);
  }

  getAttendances(groupId: number, year: number, month: number): Observable<GroupAttendance[]> {
    return this.httpClient.get<GroupAttendance[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.GROUPS.Actions.GetAttendances(groupId, year, month)));
  }

  getGroupSchedules(groupId: number): Observable<DailySchedule[]> {
    return this.httpClient.get<DailySchedule[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.GROUPS.Actions.Schedules(groupId)));
  }
}