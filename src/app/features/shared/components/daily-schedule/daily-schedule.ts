import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DailySchedule } from '../../../../core/models/daily-schedule.model';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../table/table";

@Component({
  selector: 'daily-schedule',
  imports: [
    CommonModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    TranslateModule,
    Table
],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.scss'
})
export class DailyScheduleComponent  {

  //#region Services
  public weekDaysService = inject(WeekDaysService);
  //#endregion

  @Input() dailySchedules: DailySchedule[] = [];
  @Input() showTime = true;
  @Input() showGroup = true;
  @Input() showRoom = true;
  @Input() showSubject = true;
  @Input() showTeacher = true;

  columns: TableColumn[] = [
    { title: 'shared.labels.time', field: 'startTime', type: 'time' },
    { title: 'groups.one', field: 'groupName', type: 'text' },
    { title: 'rooms.one', field: 'roomName', type: 'text' },
    { title: 'courses.one', field: 'courseName', type: 'text' }
  ];

  //#region Methods
  ngOnInit(): void {
    this.prepareDailySchedule();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dailySchedules']) {
      this.dailySchedules = [...(this.dailySchedules || [])];
      this.prepareDailySchedule();
    }
  }

  getUniqueDays(): any[] {
    if (!this.dailySchedules || !Array.isArray(this.dailySchedules)) {
      return [];
    }
    let days = this.dailySchedules.filter(schedule => schedule.dayName !== '')?.map(schedule => schedule.dayName);
    return this.weekDaysService?.getDayOptions()?.filter(day => days?.includes(day.label)) || [];
  }

  prepareDailySchedule(): void {
    this.dailySchedules?.forEach(schedule => {
      schedule.dayName = this.weekDaysService?.getDayName(schedule.day);
    });
  }

  getTime(time: string) {
    return TimeHelper.displayTime(time);
  }

  getClassesByDay(day: number): DailySchedule[] {
    if (!this.dailySchedules || !Array.isArray(this.dailySchedules)) {
      return [];
    }
    return this.dailySchedules.filter(schedule => schedule.day === day);
  }

  //#endregion

}
