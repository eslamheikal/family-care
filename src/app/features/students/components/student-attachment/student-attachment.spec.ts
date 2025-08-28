import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttachment } from './student-attachment';

describe('StudentAttachment', () => {
  let component: StudentAttachment;
  let fixture: ComponentFixture<StudentAttachment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAttachment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAttachment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
