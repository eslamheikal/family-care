import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTemplateHeader } from './pdf-template-header';

describe('PdfTemplateHeader', () => {
  let component: PdfTemplateHeader;
  let fixture: ComponentFixture<PdfTemplateHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfTemplateHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfTemplateHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
