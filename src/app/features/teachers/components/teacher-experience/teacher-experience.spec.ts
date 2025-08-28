import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherExperience } from './teacher-experience';

describe('TeacherExperience', () => {
  let component: TeacherExperience;
  let fixture: ComponentFixture<TeacherExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherExperience]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherExperience);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
