import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ApiEndpoints } from "../consts/api-endpoints";
import { ScheduleLookup } from "../models/schedule-lookup.model";
import { map, Observable } from "rxjs";
import { ClassSchedule } from "../models/class-schedule.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ScheduleService extends ApiService<ClassSchedule> {

    constructor(httpClient: HttpClient) {
        super(httpClient, ApiEndpoints.CLASS_SCHEDULES.Controller);
    }

    getLookups(): Observable<ScheduleLookup> {
        return this.httpClient.get<ScheduleLookup>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SCHEDULES.Actions.Lookups))
        .pipe(
            map((res: any) => {
                return {
                    rooms: res.rooms.sort((a: any, b: any) => a.name.localeCompare(b.name)),
                    groups: res.groups.sort((a: any, b: any) => a.name.localeCompare(b.name)),
                } as ScheduleLookup;
            })
        );
    }

    getMonthlySchedule(month: number, year: number): Observable<ClassSchedule[]> {
        return this.httpClient.get<ClassSchedule[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SCHEDULES.Actions.GetMonthlySchedule(month, year)));
    }

    create(schedule: ClassSchedule): Observable<boolean> {
        return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Create), schedule);
    }

}