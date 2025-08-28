import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyProfile } from './family-profile';

describe('FamilyProfile', () => {
  let component: FamilyProfile;
  let fixture: ComponentFixture<FamilyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
