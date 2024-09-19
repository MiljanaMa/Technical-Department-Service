import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCalorieBasedMenuModalComponent } from './edit-calorie-based-menu-modal.component';

describe('EditCalorieBasedMenuModalComponent', () => {
  let component: EditCalorieBasedMenuModalComponent;
  let fixture: ComponentFixture<EditCalorieBasedMenuModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCalorieBasedMenuModalComponent]
    });
    fixture = TestBed.createComponent(EditCalorieBasedMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
