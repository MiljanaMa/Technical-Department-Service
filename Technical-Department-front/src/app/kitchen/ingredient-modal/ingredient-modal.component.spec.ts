import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientModalComponent } from './ingredient-modal.component';

describe('IngredientModalComponent', () => {
  let component: IngredientModalComponent;
  let fixture: ComponentFixture<IngredientModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientModalComponent]
    });
    fixture = TestBed.createComponent(IngredientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
