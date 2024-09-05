import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyExcelImportComponent } from './yearly-excel-import.component';

describe('YearlyExcelImportComponent', () => {
  let component: YearlyExcelImportComponent;
  let fixture: ComponentFixture<YearlyExcelImportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearlyExcelImportComponent]
    });
    fixture = TestBed.createComponent(YearlyExcelImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
