import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQualification } from './student-qualification';

describe('StudentQualification', () => {
  let component: StudentQualification;
  let fixture: ComponentFixture<StudentQualification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentQualification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQualification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
