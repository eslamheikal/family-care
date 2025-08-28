import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFrom } from './group-from';

describe('GroupFrom', () => {
  let component: GroupFrom;
  let fixture: ComponentFixture<GroupFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFrom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupFrom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
