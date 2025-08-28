import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMonthlyPdfTemplate } from './attendance-monthly-pdf-template';

describe('AttendanceMonthlyPdfTemplate', () => {
  let component: AttendanceMonthlyPdfTemplate;
  let fixture: ComponentFixture<AttendanceMonthlyPdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceMonthlyPdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceMonthlyPdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
