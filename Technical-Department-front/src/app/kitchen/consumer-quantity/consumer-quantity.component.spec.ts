import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerQuantityComponent } from './consumer-quantity.component';

describe('ConsumerQuantityComponent', () => {
  let component: ConsumerQuantityComponent;
  let fixture: ComponentFixture<ConsumerQuantityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerQuantityComponent]
    });
    fixture = TestBed.createComponent(ConsumerQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
