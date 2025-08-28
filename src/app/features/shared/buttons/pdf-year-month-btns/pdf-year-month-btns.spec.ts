import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfYearMonthBtns } from './pdf-year-month-btns';

describe('PdfYearMonthBtns', () => {
  let component: PdfYearMonthBtns;
  let fixture: ComponentFixture<PdfYearMonthBtns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfYearMonthBtns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfYearMonthBtns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
