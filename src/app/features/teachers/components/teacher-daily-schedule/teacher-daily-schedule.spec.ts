import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDailySchedule } from './teacher-daily-schedule';

describe('TeacherDailySchedule', () => {
  let component: TeacherDailySchedule;
  let fixture: ComponentFixture<TeacherDailySchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDailySchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDailySchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
