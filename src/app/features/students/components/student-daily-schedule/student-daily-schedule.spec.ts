import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDailySchedule } from './student-daily-schedule';

describe('StudentDailySchedule', () => {
  let component: StudentDailySchedule;
  let fixture: ComponentFixture<StudentDailySchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDailySchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDailySchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
