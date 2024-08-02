import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularMenuComponent } from './tabular-menu.component';

describe('TabularMenuComponent', () => {
  let component: TabularMenuComponent;
  let fixture: ComponentFixture<TabularMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabularMenuComponent]
    });
    fixture = TestBed.createComponent(TabularMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
