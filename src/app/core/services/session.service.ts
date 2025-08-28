import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ClassSession } from '../models/class-session.model';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { SessionLookup } from '../models/session-lookup.model';
import { ClassSessionStatus } from '../enums/class-session-status.enum';
import { SessionSearchCriteria } from '../models/session-search-criteria.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends ApiService<ClassSession> {
  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.CLASS_SESSIONS.Controller);
  }

  getUserSessions(searchCriteria: SessionSearchCriteria): Observable<ClassSession[]> {
    return this.httpClient.post<ClassSession[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.User), searchCriteria);
  }

  refreshSessions(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.Refresh), {});
  }

  updateSession(session: ClassSession): Observable<ClassSession> {
    return this.httpClient.put<ClassSession>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Update), session);
  }

  getLookups(courseId: number | null = null): Observable<SessionLookup> {
    return this.httpClient.get<SessionLookup>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.Lookups(courseId ?? 0)));
  }

  updateStatus(sessionId: string | number, status: ClassSessionStatus): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.UpdateStatus(sessionId, status)), {});
  }
}