import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsList } from './groups-list';

describe('GroupsList', () => {
  let component: GroupsList;
  let fixture: ComponentFixture<GroupsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
