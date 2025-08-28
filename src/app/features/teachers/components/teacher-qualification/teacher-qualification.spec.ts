import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQualification } from './teacher-qualification';

describe('TeacherQualification', () => {
  let component: TeacherQualification;
  let fixture: ComponentFixture<TeacherQualification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherQualification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherQualification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
