import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class CourseService extends ApiService<Course> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.COURSES.Controller);
  }

  activate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.COURSES.Actions.Activate(id)), {});
  }

  deactivate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.COURSES.Actions.Deactivate(id)), {});
  }

  updateTeachers(id: number, teachers: number[]): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.COURSES.Actions.UpdateTeachers(id)), teachers);
  }
}