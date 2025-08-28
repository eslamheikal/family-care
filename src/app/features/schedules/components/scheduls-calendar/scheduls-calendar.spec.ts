import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulsCalendar } from './scheduls-calendar';

describe('SchedulsCalendar', () => {
  let component: SchedulsCalendar;
  let fixture: ComponentFixture<SchedulsCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulsCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulsCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
