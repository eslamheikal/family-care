import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAttachment } from './teacher-attachment';

describe('TeacherAttachment', () => {
  let component: TeacherAttachment;
  let fixture: ComponentFixture<TeacherAttachment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAttachment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAttachment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
