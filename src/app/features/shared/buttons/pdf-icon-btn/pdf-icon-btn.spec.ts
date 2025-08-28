import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfIconBtn } from './pdf-icon-btn';

describe('PdfIconBtn', () => {
  let component: PdfIconBtn;
  let fixture: ComponentFixture<PdfIconBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfIconBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfIconBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
