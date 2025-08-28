import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDailySchedule } from './group-daily-schedule';

describe('GroupDailySchedule', () => {
  let component: GroupDailySchedule;
  let fixture: ComponentFixture<GroupDailySchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDailySchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDailySchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
