import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliesList } from './families-list';

describe('FamiliesList', () => {
  let component: FamiliesList;
  let fixture: ComponentFixture<FamiliesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
