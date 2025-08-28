import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { UserAttachment } from '../models/user-attachment.model';
import { EnvironmentHelper } from '../helpers/environment-helper';
import { Group } from '../models/group.model';
import { DailySchedule } from '../models/daily-schedule.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class TeacherService extends ApiService<Teacher> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.TEACHERS.Controller);
  }

  activate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Activate(id)), {});
  }

  deactivate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Deactivate(id)), {});
  }

  uploadAttachment(attachment: UserAttachment): Observable<boolean> {
    const formData = new FormData();
    formData.append('DisplayName', attachment.displayName);
    formData.append('File', attachment.file, attachment.file.name);
    formData.append('UserId', attachment.userId.toString());

    return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.UploadAttachment), formData);
  }

  getViewAttachmentUrl(fileName: string): string {
    return this.appURLGenerator.getFullEndPoint(ApiEndpoints.ATTACHMENTS.Controller, ApiEndpoints.ATTACHMENTS.Actions.View(fileName));
  }

  getDownloadAttachment(fileName: string): string {
    return this.appURLGenerator.getFullEndPoint(ApiEndpoints.ATTACHMENTS.Controller, ApiEndpoints.ATTACHMENTS.Actions.Download(fileName));
  }

  deleteAttachment(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.DeleteAttachment(id)));
  }

  uploadImage(file: File, userId: number): Observable<string> {
    const formData = new FormData();
    formData.append('File', file, file.name);
    formData.append('UserId', userId.toString());
    
    return this.httpClient.post<string>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.UploadImage), formData);
  }

  getTeachersByCourseId(courseId: number): Observable<Teacher[]> {
    return this.httpClient.get<Teacher[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.GetTeachersByCourseId(courseId)));
  }

  getTeacherGroups(id: number): Observable<Group[]> {
    return this.httpClient.get<Group[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Groups(id)));
  }

  getTeacherSchedules(id: number): Observable<DailySchedule[]> {
    return this.httpClient.get<DailySchedule[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Schedules(id)));
  }
}