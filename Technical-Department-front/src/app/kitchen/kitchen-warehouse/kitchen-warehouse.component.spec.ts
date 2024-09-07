import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenWarehouseComponent } from './kitchen-warehouse.component';

describe('KitchenWarehouseComponent', () => {
  let component: KitchenWarehouseComponent;
  let fixture: ComponentFixture<KitchenWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KitchenWarehouseComponent]
    });
    fixture = TestBed.createComponent(KitchenWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
