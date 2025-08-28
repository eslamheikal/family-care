import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDashboard } from './layout-dashboard';

describe('LayoutDashboard', () => {
  let component: LayoutDashboard;
  let fixture: ComponentFixture<LayoutDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
