import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalorieBasedMenuComponent } from './calorie-based-menu.component';

describe('CalorieBasedMenuComponent', () => {
  let component: CalorieBasedMenuComponent;
  let fixture: ComponentFixture<CalorieBasedMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalorieBasedMenuComponent]
    });
    fixture = TestBed.createComponent(CalorieBasedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
