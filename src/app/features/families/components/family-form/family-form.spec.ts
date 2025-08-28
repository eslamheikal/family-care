import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyForm } from './family-form';

describe('FamilyForm', () => {
  let component: FamilyForm;
  let fixture: ComponentFixture<FamilyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
