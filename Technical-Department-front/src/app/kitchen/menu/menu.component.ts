import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DayOfWeekTab } from '../model/dayOfWeekTab';
import { Meal } from '../model/meal.model';
import { MealType } from '../model/meal-offer.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { KitchenService } from '../kitchen.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  
  mealForm: FormGroup;
  meals: Meal[] = [];

  pregnantFilteredOptions: Observable<Meal[]> = of([]);
  operatedFilteredOptions: Observable<Meal[]> = of([]);
  mildFilteredOptions: Observable<Meal[]> = of([]);
  standardFilteredOptions: Observable<Meal[]> = of([]);
  doctorsFilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom2To4FilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom4To14FilteredOptions: Observable<Meal[]> = of([]);
  diabeticFilteredOptions: Observable<Meal[]> = of([]);

  selectedDay: any = null;
  selectedMealType: any = null;
  selectedDayIndex: number = 0;
  selectedMealIndex = 0;

  constructor(private service: KitchenService){
    this.mealForm = new FormGroup({
      pregnantFormControl: new FormControl(''),
      operatedFormControl: new FormControl(''),
      mildFormControl: new FormControl(''),
      standardFormControl: new FormControl(''),
      doctorsFormControl: new FormControl(''),
      childrenFrom2To4FormControl: new FormControl(''),
      childrenFrom4To14FormControl: new FormControl(''),
      diabeticFormControl: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getMeals();
  }

  getMeals(): void {
    this.service.getMeals().subscribe({
      next: (result: Meal[]) => {
        this.meals = result;

        this.pregnantFilteredOptions = this.initializeFilteredOptions('pregnantFormControl');
        this.operatedFilteredOptions = this.initializeFilteredOptions('operatedFormControl');
        this.mildFilteredOptions = this.initializeFilteredOptions('mildFormControl');
        this.standardFilteredOptions = this.initializeFilteredOptions('standardFormControl');
        this.doctorsFilteredOptions = this.initializeFilteredOptions('doctorsFormControl');
        this.childrenFrom2To4FilteredOptions = this.initializeFilteredOptions('childrenFrom2To4FormControl');
        this.childrenFrom4To14FilteredOptions = this.initializeFilteredOptions('childrenFrom4To14FormControl');
        this.diabeticFilteredOptions = this.initializeFilteredOptions('diabeticFormControl');
      },
      error: () => {
      }
    })
  }

  displayName(meal: Meal): string {
    return meal.name;
  }

  private initializeFilteredOptions(controlName: string): Observable<Meal[]> {
    return this.mealForm.get(controlName)!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : (value as any)?.name;
        return this._filter(name);
      })
    );
  }

  private _filter(name: string): Meal[] {
    const filterValue = name.toLowerCase();

    return this.meals.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  daysOfWeekTabs: DayOfWeekTab[] = 
  [
    {id: 1, name: "Ponedeljak", date: new Date(2024, 6, 17), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 2, name: "Utorak", date: new Date(2024, 6, 18), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 3, name: "Sreda", date: new Date(2024, 6, 19), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 4, name: "Cetvrtak", date: new Date(2024, 6, 20), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 5, name: "Petak", date: new Date(2024, 6, 21), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 6, name: "Subota", date: new Date(2024, 6, 22), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 7, name: "Nedelja", date: new Date(2024, 6, 23), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
  ]

  mealTypes = Object.keys(MealType).map(key => ({ name: MealType[key as keyof typeof MealType] }));

  selectDay(day: any) {
    this.selectedDay = day;
  }

  selectMealType(index: number) {
    this.selectedMealIndex = index;
  }
}
