import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeedback } from './student-feedback';

describe('StudentFeedback', () => {
  let component: StudentFeedback;
  let fixture: ComponentFixture<StudentFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
