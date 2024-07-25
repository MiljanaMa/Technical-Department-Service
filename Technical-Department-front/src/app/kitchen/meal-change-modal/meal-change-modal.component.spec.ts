import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealChangeModalComponent } from './meal-change-modal.component';

describe('MealChangeModalComponent', () => {
  let component: MealChangeModalComponent;
  let fixture: ComponentFixture<MealChangeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MealChangeModalComponent]
    });
    fixture = TestBed.createComponent(MealChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
